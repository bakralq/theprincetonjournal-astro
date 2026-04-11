create or replace function public.toggle_community_thread_vote(target_thread_id uuid)
returns table (vote_count integer, has_voted boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  local_user_id uuid;
begin
  local_user_id := auth.uid();

  if local_user_id is null then
    raise exception 'Authentication required to vote.';
  end if;

  if not exists (
    select 1
    from public.community_threads
    where id = target_thread_id
      and status = 'published'
  ) then
    raise exception 'The selected post is not available.';
  end if;

  if exists (
    select 1
    from public.community_thread_votes
    where thread_id = target_thread_id
      and user_id = local_user_id
  ) then
    delete from public.community_thread_votes
    where thread_id = target_thread_id
      and user_id = local_user_id;

    has_voted := false;
  else
    insert into public.community_thread_votes (thread_id, user_id)
    values (target_thread_id, local_user_id)
    on conflict (thread_id, user_id) do nothing;

    has_voted := true;
  end if;

  update public.community_threads
  set vote_count = (
    select count(*)::integer
    from public.community_thread_votes
    where thread_id = target_thread_id
  )
  where id = target_thread_id
  returning community_threads.vote_count into vote_count;

  return next;
end;
$$;

revoke all on function public.toggle_community_thread_vote(uuid) from public;
grant execute on function public.toggle_community_thread_vote(uuid) to authenticated;

update public.community_threads
set vote_count = (
  select count(*)::integer
  from public.community_thread_votes
  where thread_id = public.community_threads.id
);
