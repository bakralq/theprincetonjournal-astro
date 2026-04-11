import {
  COMMUNITY_MAX_UPLOAD_BYTES,
  ensureProfile,
  escapeHtml,
  formatAbsoluteTime,
  formatFileSize,
  formatRelativeTime,
  getActiveSession,
  getCommunityErrorMessage,
  getCommunitySetupMarkup,
  hasCommunityBackend,
  membershipBadge,
  removeCommunityAttachment,
  type TPJProfile,
  uploadCommunityAttachment,
  validateCommunityAttachment,
} from '../lib/community/client';

type ThreadRecord = {
  id: string;
  slug: string;
  title: string;
  body: string;
  category: string;
  is_anonymous: boolean;
  created_at: string;
  last_activity_at: string;
  reply_count: number;
  vote_count: number;
  attachment_name?: string | null;
  attachment_url?: string | null;
  attachment_type?: string | null;
  attachment_size?: number | null;
  display_name: string;
  anonymous_handle: string;
  membership_tier?: string | null;
};

type ReplyRecord = {
  id: string;
  thread_id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  display_name: string;
  anonymous_handle: string;
  membership_tier?: string | null;
};

type CommunityState = {
  loading: boolean;
  sessionUserId: string | null;
  profile: TPJProfile | null;
  threads: ThreadRecord[];
  replies: Record<string, ReplyRecord[]>;
  openThreadId: string | null;
  error: string;
  info: string;
  searchQuery: string;
  sortMode: 'recent' | 'engagement';
  votedThreadIds: Set<string>;
};

const categories = [
  'Princeton',
  'City Hall',
  'Growth',
  'Schools',
  'Traffic',
  'Public Safety',
  'Opinion',
];

const threadAuthorLabel = (thread: ThreadRecord) =>
  thread.is_anonymous ? thread.anonymous_handle : thread.display_name;

const replyAuthorLabel = (reply: ReplyRecord) =>
  reply.is_anonymous ? reply.anonymous_handle : reply.display_name;

const slugifyThread = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const isImageAttachment = (type?: string | null) =>
  Boolean(type && type.startsWith('image/'));

const searchableThreadText = (thread: ThreadRecord) =>
  [
    thread.title,
    thread.body,
    thread.category,
    thread.display_name,
    thread.anonymous_handle,
    thread.attachment_name || '',
  ]
    .join(' ')
    .toLowerCase();

const engagementScore = (thread: ThreadRecord) =>
  thread.vote_count * 2 + thread.reply_count;

const getVisibleThreads = (state: CommunityState) => {
  const needle = state.searchQuery.trim().toLowerCase();

  const filtered = needle
    ? state.threads.filter((thread) => searchableThreadText(thread).includes(needle))
    : [...state.threads];

  if (state.sortMode === 'engagement') {
    return filtered.sort((left, right) => {
      const scoreDelta = engagementScore(right) - engagementScore(left);
      if (scoreDelta !== 0) return scoreDelta;

      return (
        new Date(right.last_activity_at || right.created_at).getTime() -
        new Date(left.last_activity_at || left.created_at).getTime()
      );
    });
  }

  return filtered.sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );
};

const threadAttachmentSummaryMarkup = (thread: ThreadRecord) => {
  if (!thread.attachment_url || !thread.attachment_name || !thread.attachment_type) {
    return '';
  }

  if (isImageAttachment(thread.attachment_type)) {
    return `
      <div class="overflow-hidden rounded-[1.5rem] border border-gray-200">
        <img
          src="${escapeHtml(thread.attachment_url)}"
          alt="${escapeHtml(thread.attachment_name)}"
          class="h-52 w-full object-cover"
          loading="lazy"
        />
      </div>
    `;
  }

  return `
    <div class="rounded-2xl border border-gray-200 bg-stone-50 px-4 py-3 text-sm text-gray-700">
      Attached file: <strong>${escapeHtml(thread.attachment_name)}</strong>
    </div>
  `;
};

const threadAttachmentExpandedMarkup = (thread: ThreadRecord) => {
  if (!thread.attachment_url || !thread.attachment_name || !thread.attachment_type) {
    return '';
  }

  if (isImageAttachment(thread.attachment_type)) {
    return `
      <div class="mt-5 overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white">
        <img
          src="${escapeHtml(thread.attachment_url)}"
          alt="${escapeHtml(thread.attachment_name)}"
          class="max-h-[32rem] w-full object-contain bg-stone-50"
          loading="lazy"
        />
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span>${escapeHtml(thread.attachment_name)}</span>
        ${
          thread.attachment_size
            ? `<span>${escapeHtml(formatFileSize(thread.attachment_size))}</span>`
            : ''
        }
        <a
          href="${escapeHtml(thread.attachment_url)}"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold text-black underline decoration-black/30 underline-offset-4"
        >
          Open full image
        </a>
      </div>
    `;
  }

  return `
    <div class="mt-5 rounded-[1.5rem] border border-gray-200 bg-stone-50 p-5">
      <p class="text-sm font-semibold text-black">${escapeHtml(
        thread.attachment_name,
      )}</p>
      <p class="mt-2 text-sm leading-6 text-gray-600">
        PDF attachment${thread.attachment_size ? ` - ${escapeHtml(formatFileSize(thread.attachment_size))}` : ''}
      </p>
      <a
        href="${escapeHtml(thread.attachment_url)}"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-4 inline-flex items-center rounded-2xl border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
      >
        Open PDF
      </a>
    </div>
  `;
};

const communityShell = (state: CommunityState) => {
  const visibleThreads = getVisibleThreads(state);

  return `
    ${
      state.error
        ? `<div class="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">${escapeHtml(
            state.error,
          )}</div>`
        : ''
    }

    ${
      state.info
        ? `<div class="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">${escapeHtml(
            state.info,
          )}</div>`
        : ''
    }

    <div class="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <aside class="space-y-6">
        <div class="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Start a thread</p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-black">Share what you are seeing, hearing, or trying to figure out.</h2>
          <p class="mt-4 text-sm leading-7 text-gray-700">
            This space is for reporting reactions, neighborhood issues, local questions, city concerns, and the day-to-day details people in Princeton should not miss.
          </p>

          ${
            state.sessionUserId && state.profile
              ? `
                <div class="mt-5 rounded-2xl border border-gray-200 bg-stone-50 px-4 py-4 text-sm text-gray-700">
                  Signed in as <strong>${escapeHtml(
                    state.profile.display_name,
                  )}</strong>. Anonymous posting will still map back to this account behind the scenes.
                </div>
                <form data-thread-form class="mt-5 space-y-4">
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Thread title</label>
                    <input
                      name="title"
                      type="text"
                      minlength="6"
                      maxlength="120"
                      required
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="What should Princeton residents be paying attention to here?"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Category</label>
                    <select
                      name="category"
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    >
                      ${categories
                        .map(
                          (category) =>
                            `<option value="${escapeHtml(category)}">${escapeHtml(
                              category,
                            )}</option>`,
                        )
                        .join('')}
                    </select>
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Thread body</label>
                    <textarea
                      name="body"
                      rows="8"
                      minlength="20"
                      maxlength="6000"
                      required
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="Add detail, context, or a real question for the community."
                    ></textarea>
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Attachment (optional)</label>
                    <input
                      name="attachment"
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,image/jpeg,image/png,image/webp,image/gif,application/pdf"
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-gray-800"
                    />
                    <p class="mt-2 text-xs leading-6 text-gray-500">
                      Images and PDFs only, up to ${escapeHtml(
                        formatFileSize(COMMUNITY_MAX_UPLOAD_BYTES),
                      )}. Public uploads remain public and may contain metadata, so do not upload sensitive identifying files.
                    </p>
                  </div>
                  <label class="flex items-start gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-sm text-gray-700">
                    <input
                      name="isAnonymous"
                      type="checkbox"
                      class="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                    <span>
                      <span class="block font-semibold text-black">Post anonymously</span>
                      <span class="mt-1 block leading-6">Use ${escapeHtml(
                        state.profile.anonymous_handle,
                      )} publicly, while the account remains attached behind the scenes.</span>
                    </span>
                  </label>
                  <button
                    type="submit"
                    class="inline-flex items-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                  >
                    Publish thread
                  </button>
                </form>
              `
              : `
                <div class="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm leading-7 text-gray-700">
                  <p class="font-semibold text-black">Sign in before you post.</p>
                  <p class="mt-2">Use your TPJ account to start threads, reply, upload supporting files, and manage app alerts.</p>
                  <a
                    href="/account"
                    class="mt-4 inline-flex items-center rounded-2xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                  >
                    Open account page
                  </a>
                </div>
              `
          }
        </div>

        <div class="rounded-[2rem] border border-gray-200 bg-stone-50 p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Before you upload</p>
          <div class="mt-4 space-y-3 text-sm leading-7 text-gray-700">
            <p>Photos, screenshots, and PDFs posted here are public once the thread goes live.</p>
            <p>Automatic checks limit file type, file size, account access, and upload path ownership.</p>
            <p>If anonymity matters, do not upload files that contain names, addresses, timestamps, or hidden metadata you do not want exposed.</p>
          </div>
        </div>
      </aside>

      <section class="space-y-4">
        <div class="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
          <div class="grid gap-4 md:grid-cols-[1fr_220px]">
            <label>
              <span class="mb-2 block text-sm font-semibold text-gray-700">Search threads</span>
              <input
                data-thread-search
                type="search"
                value="${escapeHtml(state.searchQuery)}"
                placeholder="Search titles, posts, categories, or names"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </label>
            <label>
              <span class="mb-2 block text-sm font-semibold text-gray-700">Sort by</span>
              <select
                data-thread-sort
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              >
                <option value="recent" ${
                  state.sortMode === 'recent' ? 'selected' : ''
                }>Most recent</option>
                <option value="engagement" ${
                  state.sortMode === 'engagement' ? 'selected' : ''
                }>Most engagement</option>
              </select>
            </label>
          </div>
          <p class="mt-4 text-sm text-gray-500">
            ${
              visibleThreads.length === 1
                ? '1 thread in the feed.'
                : `${visibleThreads.length} threads in the feed.`
            }
          </p>
        </div>

        ${
          state.loading
            ? `<div class="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">Loading community threads...</div>`
            : visibleThreads.length
              ? visibleThreads.map((thread) => threadCard(thread, state)).join('')
              : `<div class="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm leading-7 text-gray-600">${
                  state.searchQuery
                    ? 'No threads match that search yet.'
                    : 'No community threads yet. Start the first one and set the tone.'
                }</div>`
        }
      </section>
    </div>
  `;
};

const threadCard = (thread: ThreadRecord, state: CommunityState) => {
  const isOpen = state.openThreadId === thread.id;
  const replies = state.replies[thread.id] || [];
  const hasVoted = state.votedThreadIds.has(thread.id);

  return `
    <article class="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        data-open-thread="${escapeHtml(thread.id)}"
        class="flex w-full flex-col items-start gap-4 px-6 py-5 text-left transition hover:bg-stone-50"
      >
        <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500">
          <span>${escapeHtml(thread.category)}</span>
          <span class="normal-case tracking-normal">${escapeHtml(
            formatRelativeTime(thread.last_activity_at || thread.created_at),
          )}</span>
          <span class="normal-case tracking-normal">Posted ${escapeHtml(
            formatAbsoluteTime(thread.created_at),
          )}</span>
        </div>
        <h3 class="text-2xl font-bold tracking-tight text-black">${escapeHtml(
          thread.title,
        )}</h3>
        ${threadAttachmentSummaryMarkup(thread)}
        <p class="line-clamp-3 text-sm leading-7 text-gray-700">${escapeHtml(
          thread.body,
        )}</p>
        <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500">
          <span>${escapeHtml(threadAuthorLabel(thread))}</span>
          ${membershipBadge(thread.membership_tier)}
          <span class="normal-case tracking-normal">${thread.reply_count} ${
            thread.reply_count === 1 ? 'reply' : 'replies'
          }</span>
          <span class="normal-case tracking-normal">${thread.vote_count} ${
            thread.vote_count === 1 ? 'upvote' : 'upvotes'
          }</span>
        </div>
      </button>

      ${
        isOpen
          ? `
            <div class="border-t border-gray-200 px-6 py-5">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Thread details</p>
              <p class="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">${escapeHtml(
                thread.body,
              )}</p>

              ${threadAttachmentExpandedMarkup(thread)}

              <div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span>${thread.reply_count} ${
                  thread.reply_count === 1 ? 'reply' : 'replies'
                }</span>
                <span>${thread.vote_count} ${
                  thread.vote_count === 1 ? 'upvote' : 'upvotes'
                }</span>
                <span>Last activity ${escapeHtml(
                  formatAbsoluteTime(thread.last_activity_at || thread.created_at),
                )}</span>
              </div>

              <div class="mt-5 flex flex-wrap gap-3">
                ${
                  state.sessionUserId
                    ? `
                      <button
                        type="button"
                        data-upvote-thread="${escapeHtml(thread.id)}"
                        class="inline-flex items-center rounded-2xl border ${
                          hasVoted
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-700'
                        } px-4 py-2 text-sm font-semibold transition hover:border-black hover:text-black ${
                          hasVoted ? 'hover:bg-white' : 'hover:bg-stone-50'
                        }"
                      >
                        ${hasVoted ? 'Remove upvote' : 'Upvote thread'}
                      </button>
                    `
                    : `
                      <a
                        href="/account"
                        class="inline-flex items-center rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
                      >
                        Sign in to upvote
                      </a>
                    `
                }
              </div>

              <div class="mt-6 space-y-4">
                ${
                  replies.length
                    ? replies
                        .map(
                          (reply) => `
                            <div class="rounded-2xl border border-gray-200 bg-stone-50 px-4 py-4">
                              <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                                <span>${escapeHtml(replyAuthorLabel(reply))}</span>
                                ${membershipBadge(reply.membership_tier)}
                                <span class="normal-case tracking-normal">${escapeHtml(
                                  formatRelativeTime(reply.created_at),
                                )}</span>
                                <span class="normal-case tracking-normal">${escapeHtml(
                                  formatAbsoluteTime(reply.created_at),
                                )}</span>
                              </div>
                              <p class="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-800">${escapeHtml(
                                reply.body,
                              )}</p>
                            </div>
                          `,
                        )
                        .join('')
                    : `<div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600">No replies yet. Start the conversation.</div>`
                }
              </div>

              ${
                state.sessionUserId && state.profile
                  ? `
                    <form data-reply-form="${escapeHtml(
                      thread.id,
                    )}" class="mt-5 space-y-4 rounded-3xl border border-gray-200 bg-white p-5">
                      <div>
                        <label class="mb-2 block text-sm font-semibold text-gray-700">Reply</label>
                        <textarea
                          name="body"
                          rows="5"
                          minlength="8"
                          maxlength="4000"
                          required
                          class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                          placeholder="Add what you know, question, or disagree with."
                        ></textarea>
                      </div>
                      <label class="flex items-start gap-3 rounded-2xl border border-gray-200 px-4 py-4 text-sm text-gray-700">
                        <input name="isAnonymous" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300" />
                        <span>
                          <span class="block font-semibold text-black">Reply anonymously</span>
                          <span class="mt-1 block leading-6">Use ${escapeHtml(
                            state.profile.anonymous_handle,
                          )} publicly.</span>
                        </span>
                      </label>
                      <button
                        type="submit"
                        class="inline-flex items-center rounded-2xl border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                      >
                        Add reply
                      </button>
                    </form>
                  `
                  : `
                    <div class="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-700">
                      Sign in on <a href="/account" class="font-semibold underline">your TPJ account page</a> to reply.
                    </div>
                  `
              }
            </div>
          `
          : ''
      }
    </article>
  `;
};

export const mountCommunityHub = async (root: HTMLElement) => {
  if (root.dataset.mounted === 'true') return;
  root.dataset.mounted = 'true';

  if (!hasCommunityBackend()) {
    root.innerHTML = getCommunitySetupMarkup(
      'The community forum needs the community backend.',
      'Threads, replies, and account-linked posting are built, but the site still needs Supabase keys and the database schema before the forum can open to readers.',
    );
    return;
  }

  const { supabase } = await getActiveSession();
  if (!supabase) return;

  const state: CommunityState = {
    loading: true,
    sessionUserId: null,
    profile: null,
    threads: [],
    replies: {},
    openThreadId: null,
    error: '',
    info: '',
    searchQuery: '',
    sortMode: 'recent',
    votedThreadIds: new Set<string>(),
  };

  const loadThreads = async () => {
    const { data, error } = await supabase
      .from('community_threads_feed')
      .select('*');

    if (error) throw error;
    state.threads = (data || []) as ThreadRecord[];
  };

  const loadReplies = async (threadId: string) => {
    const { data, error } = await supabase
      .from('community_replies_feed')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    state.replies[threadId] = (data || []) as ReplyRecord[];
  };

  const loadVotes = async (userId: string | null) => {
    if (!userId) {
      state.votedThreadIds = new Set<string>();
      return;
    }

    const { data, error } = await supabase
      .from('community_thread_votes')
      .select('thread_id')
      .eq('user_id', userId);

    if (error) throw error;

    state.votedThreadIds = new Set(
      (data || []).map((record) => String(record.thread_id)),
    );
  };

  const syncState = async () => {
    state.loading = true;
    render();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      state.sessionUserId = session?.user.id || null;
      state.profile = session ? await ensureProfile(supabase, session) : null;
      await loadThreads();
      await loadVotes(state.sessionUserId);

      if (state.openThreadId) {
        await loadReplies(state.openThreadId);
      }
    } catch (error) {
      state.error = getCommunityErrorMessage(
        error,
        'Could not load the community.',
      );
    } finally {
      state.loading = false;
      render();
    }
  };

  const toggleVote = async (threadId: string) => {
    if (!state.sessionUserId) return;

    state.error = '';
    state.info = '';
    render();

    const hasVoted = state.votedThreadIds.has(threadId);

    const query = supabase.from('community_thread_votes');
    const { error } = hasVoted
      ? await query
          .delete()
          .eq('thread_id', threadId)
          .eq('user_id', state.sessionUserId)
      : await query.insert({
          thread_id: threadId,
          user_id: state.sessionUserId,
        });

    if (error) {
      state.error = error.message;
      render();
      return;
    }

    state.info = hasVoted ? 'Upvote removed.' : 'Thread upvoted.';
    await loadThreads();
    await loadVotes(state.sessionUserId);
    render();
  };

  const render = () => {
    root.innerHTML = communityShell(state);

    root.querySelectorAll<HTMLElement>('[data-open-thread]').forEach((button) => {
      button.addEventListener('click', async () => {
        const threadId = button.dataset.openThread;
        if (!threadId) return;

        state.openThreadId = state.openThreadId === threadId ? null : threadId;
        state.error = '';
        state.info = '';

        if (state.openThreadId) {
          try {
            await loadReplies(threadId);
          } catch (error) {
            state.error = getCommunityErrorMessage(
              error,
              'Could not load replies for this thread.',
            );
          }
        }

        render();
      });
    });

    root
      .querySelector<HTMLInputElement>('[data-thread-search]')
      ?.addEventListener('input', (event) => {
        const nextValue = (event.currentTarget as HTMLInputElement).value;
        state.searchQuery = nextValue;
        render();

        const nextInput = root.querySelector<HTMLInputElement>(
          '[data-thread-search]',
        );
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(nextValue.length, nextValue.length);
        }
      });

    root
      .querySelector<HTMLSelectElement>('[data-thread-sort]')
      ?.addEventListener('change', (event) => {
        state.sortMode =
          ((event.currentTarget as HTMLSelectElement).value as
            | 'recent'
            | 'engagement') || 'recent';
        render();
      });

    root.querySelectorAll<HTMLElement>('[data-upvote-thread]').forEach((button) => {
      button.addEventListener('click', async () => {
        const threadId = button.dataset.upvoteThread;
        if (!threadId) return;

        await toggleVote(threadId);
      });
    });

    const threadForm = root.querySelector<HTMLFormElement>('[data-thread-form]');
    threadForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!state.sessionUserId) return;

      state.error = '';
      state.info = '';
      render();

      const formData = new FormData(threadForm);
      const title = String(formData.get('title') || '').trim();
      const category = String(formData.get('category') || '').trim();
      const body = String(formData.get('body') || '').trim();
      const isAnonymous = formData.get('isAnonymous') === 'on';
      const attachmentInput = threadForm.querySelector<HTMLInputElement>(
        'input[name="attachment"]',
      );
      const attachmentFile = attachmentInput?.files?.[0] || null;
      const slug = `${slugifyThread(title)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;

      let attachment:
        | {
            path: string;
            url: string;
          }
        | null = null;

      try {
        if (attachmentFile) {
          const validationMessage = validateCommunityAttachment(attachmentFile);
          if (validationMessage) {
            throw new Error(validationMessage);
          }

          attachment = await uploadCommunityAttachment(
            attachmentFile,
            state.sessionUserId,
          );
        }

        const { error } = await supabase.from('community_threads').insert({
          title,
          slug,
          category,
          body,
          author_id: state.sessionUserId,
          is_anonymous: isAnonymous,
          attachment_name: attachmentFile?.name || null,
          attachment_path: attachment?.path || null,
          attachment_url: attachment?.url || null,
          attachment_type: attachmentFile?.type || null,
          attachment_size: attachmentFile?.size || null,
        });

        if (error) throw error;

        threadForm.reset();
        state.info = attachment
          ? 'Thread published with an attachment.'
          : 'Thread published.';
        await syncState();
      } catch (error) {
        if (attachment?.path) {
          await removeCommunityAttachment(attachment.path);
        }

        state.error = getCommunityErrorMessage(
          error,
          'Could not publish thread.',
        );
        render();
      }
    });

    root.querySelectorAll<HTMLFormElement>('[data-reply-form]').forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!state.sessionUserId) return;

        const threadId = form.dataset.replyForm;
        if (!threadId) return;

        state.error = '';
        state.info = '';
        render();

        const formData = new FormData(form);
        const body = String(formData.get('body') || '').trim();
        const isAnonymous = formData.get('isAnonymous') === 'on';

        const { error } = await supabase.from('community_replies').insert({
          thread_id: threadId,
          author_id: state.sessionUserId,
          body,
          is_anonymous: isAnonymous,
        });

        if (error) {
          state.error = error.message;
          render();
          return;
        }

        form.reset();
        state.info = 'Reply posted.';
        await loadReplies(threadId);
        await loadThreads();
        render();
      });
    });
  };

  const { data } = supabase.auth.onAuthStateChange(() => {
    window.setTimeout(async () => {
      state.error = '';
      state.info = '';
      await syncState();
    }, 0);
  });

  await syncState();

  window.addEventListener('beforeunload', () => {
    data.subscription.unsubscribe();
  });
};
