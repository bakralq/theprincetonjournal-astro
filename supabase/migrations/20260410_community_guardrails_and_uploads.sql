alter table public.profiles
  add column if not exists username_changed_at timestamptz;

create or replace function public.enforce_profile_update_rules()
returns trigger
language plpgsql
as $$
declare
  normalized_username text;
begin
  if new.display_name is distinct from old.display_name then
    raise exception 'Display name is locked after account creation.';
  end if;

  new.anonymous_handle := btrim(coalesce(new.anonymous_handle, ''));
  if char_length(new.anonymous_handle) < 3 or char_length(new.anonymous_handle) > 24 then
    raise exception 'Anonymous handle must be between 3 and 24 characters.';
  end if;

  normalized_username := regexp_replace(
    lower(coalesce(new.username, '')),
    '[^a-z0-9_]+',
    '_',
    'g'
  );
  normalized_username := regexp_replace(normalized_username, '(^_+|_+$)', '', 'g');
  normalized_username := left(normalized_username, 24);

  if normalized_username = '' or char_length(normalized_username) < 3 then
    raise exception 'Username must be between 3 and 24 characters.';
  end if;

  new.username := normalized_username;

  if new.username is distinct from old.username then
    if old.username_changed_at is not null
      and old.username_changed_at > now() - interval '7 days' then
      raise exception 'Username can only be changed once every 7 days.';
    end if;

    new.username_changed_at := now();
  else
    new.username_changed_at := old.username_changed_at;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guardrails on public.profiles;
create trigger profiles_guardrails
before update on public.profiles
for each row
execute function public.enforce_profile_update_rules();

alter table public.community_threads
  add column if not exists attachment_name text;

alter table public.community_threads
  add column if not exists attachment_path text;

alter table public.community_threads
  add column if not exists attachment_url text;

alter table public.community_threads
  add column if not exists attachment_type text;

alter table public.community_threads
  add column if not exists attachment_size integer;

alter table public.community_threads
  add column if not exists vote_count integer not null default 0;

create table if not exists public.community_thread_votes (
  thread_id uuid not null references public.community_threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (thread_id, user_id)
);

create index if not exists community_thread_votes_user_id_idx
  on public.community_thread_votes (user_id);

create or replace function public.refresh_thread_vote_count()
returns trigger
language plpgsql
as $$
declare
  local_thread_id uuid;
begin
  local_thread_id := coalesce(new.thread_id, old.thread_id);

  update public.community_threads
  set vote_count = (
    select count(*)
    from public.community_thread_votes
    where thread_id = local_thread_id
  )
  where id = local_thread_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists on_community_thread_vote_changed on public.community_thread_votes;
create trigger on_community_thread_vote_changed
after insert or delete on public.community_thread_votes
for each row
execute function public.refresh_thread_vote_count();

update public.community_threads
set vote_count = (
  select count(*)
  from public.community_thread_votes
  where thread_id = public.community_threads.id
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'community-uploads',
  'community-uploads',
  true,
  6291456,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Community uploads are publicly readable" on storage.objects;
create policy "Community uploads are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'community-uploads');

drop policy if exists "Authenticated users upload community files" on storage.objects;
create policy "Authenticated users upload community files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'community-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Authenticated users update own community files" on storage.objects;
create policy "Authenticated users update own community files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'community-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'community-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Authenticated users delete own community files" on storage.objects;
create policy "Authenticated users delete own community files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'community-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

alter table public.community_thread_votes enable row level security;

drop policy if exists "users_read_own_thread_votes" on public.community_thread_votes;
create policy "users_read_own_thread_votes"
on public.community_thread_votes
for select
using (auth.uid() = user_id);

drop policy if exists "users_insert_own_thread_votes" on public.community_thread_votes;
create policy "users_insert_own_thread_votes"
on public.community_thread_votes
for insert
with check (auth.uid() = user_id);

drop policy if exists "users_delete_own_thread_votes" on public.community_thread_votes;
create policy "users_delete_own_thread_votes"
on public.community_thread_votes
for delete
using (auth.uid() = user_id);

drop view if exists public.community_threads_feed;
create view public.community_threads_feed as
select
  threads.id,
  threads.slug,
  threads.title,
  threads.body,
  threads.category,
  threads.is_anonymous,
  threads.created_at,
  threads.last_activity_at,
  threads.reply_count,
  threads.vote_count,
  threads.attachment_name,
  threads.attachment_url,
  threads.attachment_type,
  threads.attachment_size,
  profiles.display_name,
  profiles.anonymous_handle,
  profiles.membership_tier
from public.community_threads threads
join public.profiles profiles on profiles.id = threads.author_id
where threads.status = 'published';

grant select on public.community_threads_feed to anon, authenticated;
grant select, insert, delete on public.community_thread_votes to authenticated;
