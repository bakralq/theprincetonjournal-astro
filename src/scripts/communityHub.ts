import {
  ensureProfile,
  escapeHtml,
  formatRelativeTime,
  getActiveSession,
  getCommunitySetupMarkup,
  hasCommunityBackend,
  membershipBadge,
  type TPJProfile,
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

const communityShell = (state: CommunityState) => `
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
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Post with intention</p>
        <h2 class="mt-3 text-2xl font-bold tracking-tight text-black">Community threads for people who actually care about Princeton.</h2>
        <p class="mt-4 text-sm leading-7 text-gray-700">
          Start a discussion about local policy, roads, schools, city growth, or a story TPJ should keep chasing.
        </p>

        ${
          state.sessionUserId && state.profile
            ? `
              <div class="mt-5 rounded-2xl border border-gray-200 bg-stone-50 px-4 py-4 text-sm text-gray-700">
                Signed in as <strong>${escapeHtml(
                  state.profile.display_name,
                )}</strong>. Anonymous posting will still map back to this account.
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
                <p class="mt-2">Use your TPJ account to start threads, reply, and manage app alerts.</p>
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
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Ground rules</p>
        <ul class="mt-4 space-y-3 text-sm leading-7 text-gray-700">
          <li>Bring firsthand context, useful questions, or constructive disagreement.</li>
          <li>Do not dox, threaten, or target private people.</li>
          <li>Registry and public-safety discussions still need basic decency and care.</li>
          <li>TPJ can remove posts that make the community worse instead of better.</li>
        </ul>
      </div>
    </aside>

    <section class="space-y-4">
      ${
        state.loading
          ? `<div class="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">Loading community threads...</div>`
          : state.threads.length
            ? state.threads.map((thread) => threadCard(thread, state)).join('')
            : `<div class="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm leading-7 text-gray-600">No community threads yet. Start the first one and set the tone.</div>`
      }
    </section>
  </div>
`;

const threadCard = (thread: ThreadRecord, state: CommunityState) => {
  const isOpen = state.openThreadId === thread.id;
  const replies = state.replies[thread.id] || [];

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
        </div>
        <h3 class="text-2xl font-bold tracking-tight text-black">${escapeHtml(
          thread.title,
        )}</h3>
        <p class="line-clamp-3 text-sm leading-7 text-gray-700">${escapeHtml(
          thread.body,
        )}</p>
        <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500">
          <span>${escapeHtml(threadAuthorLabel(thread))}</span>
          ${membershipBadge(thread.membership_tier)}
          <span class="normal-case tracking-normal">${thread.reply_count} ${
            thread.reply_count === 1 ? 'reply' : 'replies'
          }</span>
        </div>
      </button>

      ${
        isOpen
          ? `
            <div class="border-t border-gray-200 px-6 py-5">
              <p class="whitespace-pre-wrap text-sm leading-7 text-gray-700">${escapeHtml(
                thread.body,
              )}</p>

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
  };

  const loadThreads = async () => {
    const { data, error } = await supabase
      .from('community_threads_feed')
      .select('*')
      .order('last_activity_at', { ascending: false });

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

      if (state.openThreadId) {
        await loadReplies(state.openThreadId);
      }
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : 'Could not load the community.';
    } finally {
      state.loading = false;
      render();
    }
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
            state.error =
              error instanceof Error
                ? error.message
                : 'Could not load replies for this thread.';
          }
        }

        render();
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
      const slug = `${slugifyThread(title)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;

      const { error } = await supabase.from('community_threads').insert({
        title,
        slug,
        category,
        body,
        author_id: state.sessionUserId,
        is_anonymous: isAnonymous,
      });

      if (error) {
        state.error = error.message;
        render();
        return;
      }

      threadForm.reset();
      state.info = 'Thread published.';
      await syncState();
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

  const { data } = supabase.auth.onAuthStateChange(async () => {
    state.error = '';
    state.info = '';
    await syncState();
  });

  await syncState();

  window.addEventListener('beforeunload', () => {
    data.subscription.unsubscribe();
  });
};
