create extension if not exists pgcrypto;

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.make_profile_username(raw_value text, owner_id uuid)
returns text
language sql
immutable
as $$
  select
    concat(
      left(
        coalesce(
          nullif(
            regexp_replace(
              lower(coalesce(raw_value, 'tpj_reader')),
              '(^_+|_+$)',
              '',
              'g'
            ),
            ''
          ),
          'tpj_reader'
        ),
        19
      ),
      '_',
      lower(left(owner_id::text, 4))
    );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  username text not null unique check (char_length(username) between 3 and 24),
  anonymous_handle text not null check (char_length(anonymous_handle) between 3 and 24),
  bio text,
  membership_tier text default 'reader' check (membership_tier in ('reader', 'supporter', 'founding')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 8 and 3000),
  is_anonymous boolean not null default false,
  status text not null default 'published' check (status in ('published', 'pending', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists article_comments_article_slug_idx
  on public.article_comments (article_slug, created_at desc);

create table if not exists public.community_threads (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 6 and 120),
  body text not null check (char_length(body) between 20 and 6000),
  category text not null check (category in ('Princeton', 'City Hall', 'Growth', 'Schools', 'Traffic', 'Public Safety', 'Opinion')),
  author_id uuid not null references public.profiles (id) on delete cascade,
  is_anonymous boolean not null default false,
  status text not null default 'published' check (status in ('published', 'pending', 'hidden')),
  is_locked boolean not null default false,
  reply_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create index if not exists community_threads_last_activity_idx
  on public.community_threads (last_activity_at desc);

create table if not exists public.community_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.community_threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 8 and 4000),
  is_anonymous boolean not null default false,
  status text not null default 'published' check (status in ('published', 'pending', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_replies_thread_idx
  on public.community_replies (thread_id, created_at asc);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  new_articles boolean not null default true,
  tracker_updates boolean not null default true,
  registry_updates boolean not null default true,
  weekly_picks boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('ios', 'android', 'web')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_row_updated_at();

drop trigger if exists article_comments_updated_at on public.article_comments;
create trigger article_comments_updated_at
before update on public.article_comments
for each row
execute function public.set_row_updated_at();

drop trigger if exists community_threads_updated_at on public.community_threads;
create trigger community_threads_updated_at
before update on public.community_threads
for each row
execute function public.set_row_updated_at();

drop trigger if exists community_replies_updated_at on public.community_replies;
create trigger community_replies_updated_at
before update on public.community_replies
for each row
execute function public.set_row_updated_at();

drop trigger if exists notification_preferences_updated_at on public.notification_preferences;
create trigger notification_preferences_updated_at
before update on public.notification_preferences
for each row
execute function public.set_row_updated_at();

drop trigger if exists push_subscriptions_updated_at on public.push_subscriptions;
create trigger push_subscriptions_updated_at
before update on public.push_subscriptions
for each row
execute function public.set_row_updated_at();

create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  local_name text;
begin
  local_name := split_part(coalesce(new.email, 'tpj-reader@example.com'), '@', 1);

  insert into public.profiles (id, display_name, username, anonymous_handle)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', local_name),
    public.make_profile_username(
      regexp_replace(
        lower(coalesce(new.raw_user_meta_data ->> 'username', local_name)),
        '[^a-z0-9_]+',
        '_',
        'g'
      ),
      new.id
    ),
    coalesce(new.raw_user_meta_data ->> 'anonymous_handle', 'Neighbor ' || upper(left(new.id::text, 4)))
  )
  on conflict (id) do update
    set display_name = excluded.display_name;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_profile();

create or replace function public.bump_thread_activity()
returns trigger
language plpgsql
as $$
begin
  update public.community_threads
    set reply_count = (
      select count(*)
      from public.community_replies
      where thread_id = new.thread_id
        and status = 'published'
    ),
        last_activity_at = now()
  where id = new.thread_id;

  return new;
end;
$$;

drop trigger if exists on_community_reply_created on public.community_replies;
create trigger on_community_reply_created
after insert on public.community_replies
for each row
execute function public.bump_thread_activity();

alter table public.profiles enable row level security;
alter table public.article_comments enable row level security;
alter table public.community_threads enable row level security;
alter table public.community_replies enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.push_subscriptions enable row level security;

drop policy if exists "profiles_are_public" on public.profiles;
create policy "profiles_are_public"
on public.profiles
for select
using (true);

drop policy if exists "users_manage_own_profile" on public.profiles;
create policy "users_manage_own_profile"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "published_comments_are_public" on public.article_comments;
create policy "published_comments_are_public"
on public.article_comments
for select
using (status = 'published' or auth.uid() = author_id);

drop policy if exists "users_manage_own_comments" on public.article_comments;
create policy "users_manage_own_comments"
on public.article_comments
for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "published_threads_are_public" on public.community_threads;
create policy "published_threads_are_public"
on public.community_threads
for select
using (status = 'published' or auth.uid() = author_id);

drop policy if exists "users_manage_own_threads" on public.community_threads;
create policy "users_manage_own_threads"
on public.community_threads
for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "published_replies_are_public" on public.community_replies;
create policy "published_replies_are_public"
on public.community_replies
for select
using (
  status = 'published'
  or auth.uid() = author_id
);

drop policy if exists "users_manage_own_replies" on public.community_replies;
create policy "users_manage_own_replies"
on public.community_replies
for all
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "users_manage_own_notification_preferences" on public.notification_preferences;
create policy "users_manage_own_notification_preferences"
on public.notification_preferences
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users_manage_own_push_subscriptions" on public.push_subscriptions;
create policy "users_manage_own_push_subscriptions"
on public.push_subscriptions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop view if exists public.article_comments_feed;
create view public.article_comments_feed as
select
  comments.id,
  comments.article_slug,
  comments.body,
  comments.is_anonymous,
  comments.created_at,
  profiles.display_name,
  profiles.anonymous_handle,
  profiles.membership_tier
from public.article_comments comments
join public.profiles profiles on profiles.id = comments.author_id
where comments.status = 'published';

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
  profiles.display_name,
  profiles.anonymous_handle,
  profiles.membership_tier
from public.community_threads threads
join public.profiles profiles on profiles.id = threads.author_id
where threads.status = 'published';

drop view if exists public.community_replies_feed;
create view public.community_replies_feed as
select
  replies.id,
  replies.thread_id,
  replies.body,
  replies.is_anonymous,
  replies.created_at,
  profiles.display_name,
  profiles.anonymous_handle,
  profiles.membership_tier
from public.community_replies replies
join public.profiles profiles on profiles.id = replies.author_id
where replies.status = 'published';

grant select on public.profiles to anon, authenticated;
grant select on public.article_comments_feed to anon, authenticated;
grant select on public.community_threads_feed to anon, authenticated;
grant select on public.community_replies_feed to anon, authenticated;

grant select, insert, update on public.article_comments to authenticated;
grant select, insert, update on public.community_threads to authenticated;
grant select, insert, update on public.community_replies to authenticated;
grant select, insert, update on public.notification_preferences to authenticated;
grant select, insert, update on public.push_subscriptions to authenticated;
grant select, insert, update on public.profiles to authenticated;
