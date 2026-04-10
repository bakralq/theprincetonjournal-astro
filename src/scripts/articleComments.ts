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

type CommentRecord = {
  id: string;
  article_slug: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  display_name: string;
  anonymous_handle: string;
  membership_tier?: string | null;
};

type CommentState = {
  loading: boolean;
  sessionUserId: string | null;
  profile: TPJProfile | null;
  comments: CommentRecord[];
  error: string;
  info: string;
};

const commentsShell = (state: CommentState) => `
  <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div>
      ${
        state.error
          ? `<div class="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">${escapeHtml(
              state.error,
            )}</div>`
          : ''
      }

      ${
        state.info
          ? `<div class="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">${escapeHtml(
              state.info,
            )}</div>`
          : ''
      }

      ${
        state.loading
          ? `<div class="rounded-3xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm">Loading comments...</div>`
          : state.comments.length
            ? `<div class="space-y-4">${state.comments
                .map((comment) => commentCard(comment))
                .join('')}</div>`
            : `<div class="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm leading-7 text-gray-600">No comments yet. Be the first reader to start the conversation.</div>`
      }
    </div>

    <aside class="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Join the discussion</p>
      <h3 class="mt-3 text-2xl font-bold tracking-tight text-black">Comments stay tied to real accounts.</h3>
      <p class="mt-3 text-sm leading-7 text-gray-700">
        Readers can post with their display name or with an anonymous neighbor handle. Either way, it stays attached to one TPJ account.
      </p>

      ${
        state.sessionUserId && state.profile
          ? `
            <div class="mt-5 rounded-2xl border border-gray-200 bg-stone-50 px-4 py-4 text-sm text-gray-700">
              Signed in as <strong>${escapeHtml(
                state.profile.display_name,
              )}</strong>
            </div>
            <form data-comment-form class="mt-5 space-y-4">
              <div>
                <label class="mb-2 block text-sm font-semibold text-gray-700">Your comment</label>
                <textarea
                  name="body"
                  rows="6"
                  minlength="8"
                  maxlength="3000"
                  required
                  class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  placeholder="Add context, ask a question, or push the reporting further."
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
                  <span class="mt-1 block leading-6">Your comment will show as ${escapeHtml(
                    state.profile.anonymous_handle,
                  )}, but it still stays tied to your account behind the scenes.</span>
                </span>
              </label>
              <div class="flex flex-wrap gap-3">
                <button
                  type="submit"
                  class="inline-flex items-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Post comment
                </button>
                <a
                  href="/account"
                  class="inline-flex items-center rounded-2xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
                >
                  Manage account
                </a>
              </div>
            </form>
          `
          : `
            <div class="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm leading-7 text-gray-700">
              <p class="font-semibold text-black">Sign in to comment.</p>
              <p class="mt-2">Use your TPJ account to join the conversation, then come right back here to post.</p>
              <a
                href="/account"
                class="mt-4 inline-flex items-center rounded-2xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Open account page
              </a>
            </div>
          `
      }
    </aside>
  </div>
`;

const commentCard = (comment: CommentRecord) => {
  const authorName = comment.is_anonymous
    ? comment.anonymous_handle
    : comment.display_name;

  return `
    <article class="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
      <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-500">
        <span>${escapeHtml(authorName)}</span>
        ${membershipBadge(comment.membership_tier)}
        <span class="normal-case tracking-normal">${escapeHtml(
          formatRelativeTime(comment.created_at),
        )}</span>
      </div>
      <p class="mt-4 whitespace-pre-wrap text-base leading-7 text-gray-800">${escapeHtml(
        comment.body,
      )}</p>
    </article>
  `;
};

export const mountArticleComments = async (root: HTMLElement) => {
  if (root.dataset.mounted === 'true') return;
  root.dataset.mounted = 'true';

  if (!hasCommunityBackend()) {
    root.innerHTML = getCommunitySetupMarkup(
      'Article comments need the community backend.',
      'The comments UI is built, but the site needs Supabase credentials and the SQL schema before readers can sign in and post.',
    );
    return;
  }

  const articleSlug = root.dataset.articleSlug;
  if (!articleSlug) return;

  const { supabase } = await getActiveSession();
  if (!supabase) return;

  const state: CommentState = {
    loading: true,
    sessionUserId: null,
    profile: null,
    comments: [],
    error: '',
    info: '',
  };

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('article_comments_feed')
      .select('*')
      .eq('article_slug', articleSlug)
      .order('created_at', { ascending: false });

    if (error) throw error;
    state.comments = (data || []) as CommentRecord[];
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
      await loadComments();
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : 'Could not load comments.';
    } finally {
      state.loading = false;
      render();
    }
  };

  const render = () => {
    root.innerHTML = commentsShell(state);

    const form = root.querySelector<HTMLFormElement>('[data-comment-form]');
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!state.sessionUserId) return;
      state.error = '';
      state.info = '';
      render();

      const formData = new FormData(form);
      const body = String(formData.get('body') || '').trim();
      const isAnonymous = formData.get('isAnonymous') === 'on';

      const { error } = await supabase.from('article_comments').insert({
        article_slug: articleSlug,
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
      state.info = 'Comment posted.';
      await syncState();
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
