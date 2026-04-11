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
  ownedPostIds: Set<string>;
  postAttachmentPaths: Record<string, string>;
  replies: Record<string, ReplyRecord[]>;
  expandedPostId: string | null;
  expandedReplyThreadIds: Set<string>;
  composerOpen: boolean;
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

const POST_PREVIEW_LENGTH = 430;
const REPLY_PREVIEW_COUNT = 5;

const upvoteIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 15V5"></path>
    <path d="M5.75 9.25 10 5l4.25 4.25"></path>
  </svg>
`;

const replyIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 5.75A2.25 2.25 0 0 1 6.75 3.5h6.5A2.25 2.25 0 0 1 15.5 5.75v4.5A2.25 2.25 0 0 1 13.25 12.5H9l-3.5 3v-3H6.75A2.25 2.25 0 0 1 4.5 10.25v-4.5Z"></path>
  </svg>
`;

const shareIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12.75 4.75h2.5v2.5"></path>
    <path d="M8 12 15.25 4.75"></path>
    <path d="M15.5 10.25v4A1.25 1.25 0 0 1 14.25 15.5h-8.5A1.25 1.25 0 0 1 4.5 14.25v-8.5A1.25 1.25 0 0 1 5.75 4.5h4"></path>
  </svg>
`;

const reportIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 6.25v4.25"></path>
    <path d="M10 13.5h.01"></path>
    <path d="M8.35 3.9 2.9 13.1A1.2 1.2 0 0 0 3.93 15h12.14a1.2 1.2 0 0 0 1.03-1.9L11.65 3.9a1.9 1.9 0 0 0-3.3 0Z"></path>
  </svg>
`;

const deleteIcon = `
  <svg aria-hidden="true" viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5.5 6.25h9"></path>
    <path d="M7.25 6.25v8"></path>
    <path d="M12.75 6.25v8"></path>
    <path d="M8.25 4.5h3.5"></path>
    <path d="M6.5 6.25l.45 8.2A1.2 1.2 0 0 0 8.15 15.5h3.7a1.2 1.2 0 0 0 1.2-1.05l.45-8.2"></path>
  </svg>
`;

const threadAuthorLabel = (thread: ThreadRecord) =>
  thread.is_anonymous ? thread.anonymous_handle : thread.display_name;

const replyAuthorLabel = (reply: ReplyRecord) =>
  reply.is_anonymous ? reply.anonymous_handle : reply.display_name;

const slugifyPost = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const isImageAttachment = (type?: string | null) =>
  Boolean(type && type.startsWith('image/'));

const searchablePostText = (thread: ThreadRecord) =>
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

const getVisiblePosts = (state: CommunityState) => {
  const needle = state.searchQuery.trim().toLowerCase();

  const filtered = needle
    ? state.threads.filter((thread) => searchablePostText(thread).includes(needle))
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

const truncatePostBody = (body: string) => {
  if (body.length <= POST_PREVIEW_LENGTH) {
    return {
      preview: body,
      truncated: false,
    };
  }

  return {
    preview: `${body.slice(0, POST_PREVIEW_LENGTH).trimEnd()}...`,
    truncated: true,
  };
};

const attachmentMarkup = (thread: ThreadRecord) => {
  if (!thread.attachment_url || !thread.attachment_type) {
    return '';
  }

  if (isImageAttachment(thread.attachment_type)) {
    return `
      <div class="mt-4 overflow-hidden rounded-[1.5rem] border border-gray-200 bg-stone-50">
        <img
          src="${escapeHtml(thread.attachment_url)}"
          alt="${escapeHtml(thread.attachment_name || 'Post attachment')}"
          class="max-h-[28rem] w-full object-cover"
          loading="lazy"
        />
      </div>
    `;
  }

  return `
    <div class="mt-4 rounded-[1.5rem] border border-gray-200 bg-stone-50 p-4">
      <a
        href="${escapeHtml(thread.attachment_url)}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center rounded-2xl border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
      >
        View attachment
      </a>
    </div>
  `;
};

const replyListMarkup = (
  thread: ThreadRecord,
  replies: ReplyRecord[],
  state: CommunityState,
) => {
  if (!replies.length) {
    return `
      <div class="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600">
        No replies yet. Start the conversation.
      </div>
    `;
  }

  const showingAllReplies = state.expandedReplyThreadIds.has(thread.id);
  const visibleReplies = showingAllReplies
    ? replies
    : replies.slice(0, REPLY_PREVIEW_COUNT);

  return `
    <div class="mt-5 space-y-3">
      ${visibleReplies
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
        .join('')}

      ${
        replies.length > REPLY_PREVIEW_COUNT
          ? `
            <button
              type="button"
              data-toggle-all-replies="${escapeHtml(thread.id)}"
              class="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
            >
              ${showingAllReplies ? 'Show fewer replies' : `View all ${replies.length} replies`}
            </button>
          `
          : ''
      }
    </div>
  `;
};

const communityShell = (state: CommunityState) => {
  const visiblePosts = getVisiblePosts(state);

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

    <section class="space-y-5">
      <div class="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Posts</p>
            <h2 class="mt-2 text-2xl font-bold tracking-tight text-black">Local posts, real context, and what people are actually seeing.</h2>
            <p class="mt-3 text-sm leading-7 text-gray-700">
              Search, sort, and follow what people in Princeton are surfacing right now.
            </p>
          </div>

          ${
            state.sessionUserId && state.profile
              ? `
                <button
                  type="button"
                  data-toggle-composer
                  class="inline-flex items-center justify-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  ${state.composerOpen ? 'Close post maker' : 'Create a post'}
                </button>
              `
              : `
                <a
                  href="/account"
                  class="inline-flex items-center justify-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Sign in to post
                </a>
              `
          }
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
          <label>
            <span class="mb-2 block text-sm font-semibold text-gray-700">Search posts</span>
            <input
              data-post-search
              type="search"
              value="${escapeHtml(state.searchQuery)}"
              placeholder="Search titles, posts, categories, or names"
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </label>
          <label>
            <span class="mb-2 block text-sm font-semibold text-gray-700">Sort by</span>
            <select
              data-post-sort
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
            visiblePosts.length === 1
              ? '1 post in the feed.'
              : `${visiblePosts.length} posts in the feed.`
          }
        </p>
      </div>

      ${
        state.sessionUserId && state.profile && state.composerOpen
          ? `
            <div class="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Create a post</p>
              <h3 class="mt-2 text-2xl font-bold tracking-tight text-black">Share what you are seeing, hearing, or trying to figure out.</h3>
              <p class="mt-3 text-sm leading-7 text-gray-700">
                Signed in as <strong>${escapeHtml(
                  state.profile.display_name,
                )}</strong>. You can post publicly or anonymously, but the post still maps back to your account behind the scenes.
              </p>

              <form data-post-form class="mt-6 space-y-5">
                <div class="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Post title</label>
                    <input
                      name="title"
                      type="text"
                      minlength="6"
                      maxlength="120"
                      required
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="What should Princeton residents be paying attention to?"
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
                </div>

                <div>
                  <label class="mb-2 block text-sm font-semibold text-gray-700">Post body</label>
                  <textarea
                    name="body"
                    rows="7"
                    minlength="20"
                    maxlength="6000"
                    required
                    class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    placeholder="Add detail, context, or a real question for the community."
                  ></textarea>
                </div>

                <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
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
                      )}. Public uploads remain public, so do not upload sensitive identifying files.
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
                      )} publicly.</span>
                    </span>
                  </label>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    class="inline-flex items-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                  >
                    Publish post
                  </button>
                  <button
                    type="button"
                    data-toggle-composer
                    class="inline-flex items-center rounded-2xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          `
          : ''
      }

      ${
        state.loading
          ? `<div class="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">Loading posts...</div>`
          : visiblePosts.length
            ? `<div class="space-y-5">${visiblePosts
                .map((thread) => postCard(thread, state))
                .join('')}</div>`
            : `<div class="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm leading-7 text-gray-600">${
                state.searchQuery
                  ? 'No posts match that search yet.'
                  : 'No posts yet. Start the first one and set the tone.'
              }</div>`
      }
    </section>
  `;
};

const postCard = (thread: ThreadRecord, state: CommunityState) => {
  const postIsExpanded = state.expandedPostId === thread.id;
  const replies = state.replies[thread.id] || [];
  const hasVoted = state.votedThreadIds.has(thread.id);
  const isOwnPost = state.ownedPostIds.has(thread.id);
  const bodyPreview = truncatePostBody(thread.body);
  const displayedBody =
    postIsExpanded || !bodyPreview.truncated ? thread.body : bodyPreview.preview;

  return `
    <article class="overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-500">
        <span>${escapeHtml(thread.category)}</span>
        <span class="normal-case tracking-normal">${escapeHtml(
          formatRelativeTime(thread.last_activity_at || thread.created_at),
        )}</span>
        <span class="normal-case tracking-normal">Posted ${escapeHtml(
          formatAbsoluteTime(thread.created_at),
        )}</span>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span class="font-semibold text-black">${escapeHtml(
          threadAuthorLabel(thread),
        )}</span>
        ${membershipBadge(thread.membership_tier)}
      </div>

      <h3 class="mt-3 text-2xl font-bold tracking-tight text-black">${escapeHtml(
        thread.title,
      )}</h3>

      ${attachmentMarkup(thread)}

      <div class="mt-4 space-y-4">
        <p class="whitespace-pre-wrap text-sm leading-7 text-gray-700">${escapeHtml(
          displayedBody,
        )}</p>

        ${
          bodyPreview.truncated
            ? `
              <button
                type="button"
                data-toggle-post="${escapeHtml(thread.id)}"
                class="inline-flex items-center rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
              >
                ${postIsExpanded ? 'Show less' : 'Read full post'}
              </button>
            `
            : ''
        }
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-5">
        ${
          state.sessionUserId
            ? `
              <button
                type="button"
                data-upvote-post="${escapeHtml(thread.id)}"
                class="inline-flex items-center gap-2 rounded-2xl border ${
                  hasVoted
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 text-gray-700'
                } px-4 py-2 text-sm font-semibold transition hover:border-black ${
                  hasVoted ? 'hover:bg-white hover:text-black' : 'hover:bg-stone-50 hover:text-black'
                }"
              >
                ${upvoteIcon}
                <span>${thread.vote_count}</span>
              </button>
            `
            : `
              <a
                href="/account"
                class="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
              >
                ${upvoteIcon}
                <span>${thread.vote_count}</span>
              </a>
            `
        }

        <button
          type="button"
          data-open-replies="${escapeHtml(thread.id)}"
          class="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
        >
          ${replyIcon}
          <span>${thread.reply_count}</span>
        </button>

        <button
          type="button"
          data-share-post="${escapeHtml(thread.id)}"
          class="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
        >
          ${shareIcon}
          <span>Share</span>
        </button>

        <button
          type="button"
          data-report-post="${escapeHtml(thread.id)}"
          class="inline-flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
        >
          ${reportIcon}
          <span>Report</span>
        </button>

        ${
          isOwnPost
            ? `
              <button
                type="button"
                data-delete-post="${escapeHtml(thread.id)}"
                class="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50"
              >
                ${deleteIcon}
                <span>Delete</span>
              </button>
            `
            : ''
        }
      </div>

      ${
        postIsExpanded
          ? `
            <div class="mt-6 border-t border-gray-200 pt-6">
              ${replyListMarkup(thread, replies, state)}

              ${
                state.sessionUserId && state.profile
                  ? `
                    <form data-reply-form="${escapeHtml(
                      thread.id,
                    )}" class="mt-5 space-y-4 rounded-3xl border border-gray-200 bg-stone-50 p-5">
                      <div>
                        <label class="mb-2 block text-sm font-semibold text-gray-700">Reply</label>
                        <textarea
                          name="body"
                          rows="5"
                          minlength="8"
                          maxlength="4000"
                          required
                          class="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                          placeholder="Add what you know, ask a question, or respond."
                        ></textarea>
                      </div>
                      <div class="flex flex-wrap items-center gap-4">
                        <label class="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-700">
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
                          class="inline-flex items-center rounded-2xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                        >
                          Add reply
                        </button>
                      </div>
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
      'Posts, replies, uploads, and account-linked activity are built, but the site still needs Supabase keys and the database schema before the forum can open to readers.',
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
    ownedPostIds: new Set<string>(),
    postAttachmentPaths: {},
    replies: {},
    expandedPostId: null,
    expandedReplyThreadIds: new Set<string>(),
    composerOpen: false,
    error: '',
    info: '',
    searchQuery: '',
    sortMode: 'recent',
    votedThreadIds: new Set<string>(),
  };

  const loadPosts = async () => {
    const { data, error } = await supabase.from('community_threads_feed').select('*');

    if (error) throw error;
    state.threads = (data || []) as ThreadRecord[];
  };

  const loadPostMeta = async (userId: string | null) => {
    if (!userId) {
      state.ownedPostIds = new Set<string>();
      state.postAttachmentPaths = {};
      return;
    }

    const { data, error } = await supabase
      .from('community_threads')
      .select('id, author_id, attachment_path')
      .eq('author_id', userId);

    if (error) throw error;

    state.ownedPostIds = new Set((data || []).map((record) => String(record.id)));
    state.postAttachmentPaths = Object.fromEntries(
      (data || []).map((record) => [
        String(record.id),
        String(record.attachment_path || ''),
      ]),
    );
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
      await loadPosts();
      await loadPostMeta(state.sessionUserId);
      await loadVotes(state.sessionUserId);

      if (state.expandedPostId) {
        await loadReplies(state.expandedPostId);
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

  const toggleReplies = async (threadId: string) => {
    state.error = '';
    state.info = '';

    if (state.expandedPostId === threadId) {
      state.expandedPostId = null;
      render();
      return;
    }

    state.expandedPostId = threadId;

    try {
      await loadReplies(threadId);
    } catch (error) {
      state.error = getCommunityErrorMessage(
        error,
        'Could not load replies for this post.',
      );
    }

    render();
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

    state.info = hasVoted ? 'Upvote removed.' : 'Post upvoted.';
    await loadPosts();
    await loadPostMeta(state.sessionUserId);
    await loadVotes(state.sessionUserId);
    render();
  };

  const sharePost = async (thread: ThreadRecord) => {
    const shareUrl = `${window.location.origin}/community#post-${thread.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: thread.title,
          text: `${thread.title} | The Princeton Journal Community`,
          url: shareUrl,
        });
        state.info = 'Post shared.';
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        state.info = 'Post link copied.';
      } else {
        window.prompt('Copy this post link:', shareUrl);
      }
    } catch (error) {
      state.error = getCommunityErrorMessage(
        error,
        'Could not share this post.',
      );
    }

    render();
  };

  const reportPost = (thread: ThreadRecord) => {
    const reportUrl = `${window.location.origin}/community#post-${thread.id}`;
    const subject = encodeURIComponent(`Report TPJ community post: ${thread.title}`);
    const body = encodeURIComponent(
      `Please review this community post.\n\nTitle: ${thread.title}\nPost ID: ${thread.id}\nLink: ${reportUrl}\n\nReason:\n`,
    );

    window.location.href = `mailto:theprincetonjournal@gmail.com?subject=${subject}&body=${body}`;
  };

  const deletePost = async (threadId: string) => {
    if (!state.sessionUserId || !state.ownedPostIds.has(threadId)) return;

    const confirmed = window.confirm(
      'Delete this post? Replies under it will be removed too.',
    );
    if (!confirmed) return;

    state.error = '';
    state.info = '';
    render();

    const attachmentPath = state.postAttachmentPaths[threadId];
    if (attachmentPath) {
      await removeCommunityAttachment(attachmentPath);
    }

    const { error } = await supabase
      .from('community_threads')
      .delete()
      .eq('id', threadId)
      .eq('author_id', state.sessionUserId);

    if (error) {
      state.error = getCommunityErrorMessage(
        error,
        'Could not delete this post.',
      );
      render();
      return;
    }

    if (state.expandedPostId === threadId) {
      state.expandedPostId = null;
    }
    state.expandedReplyThreadIds.delete(threadId);
    delete state.replies[threadId];
    state.info = 'Post deleted.';
    await loadPosts();
    await loadPostMeta(state.sessionUserId);
    await loadVotes(state.sessionUserId);
    render();
  };

  const render = () => {
    root.innerHTML = communityShell(state);

    root.querySelector<HTMLElement>('[data-toggle-composer]')?.addEventListener(
      'click',
      () => {
        state.composerOpen = !state.composerOpen;
        render();
      },
    );

    root
      .querySelector<HTMLInputElement>('[data-post-search]')
      ?.addEventListener('input', (event) => {
        const nextValue = (event.currentTarget as HTMLInputElement).value;
        state.searchQuery = nextValue;
        render();

        const nextInput = root.querySelector<HTMLInputElement>(
          '[data-post-search]',
        );
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(nextValue.length, nextValue.length);
        }
      });

    root
      .querySelector<HTMLSelectElement>('[data-post-sort]')
      ?.addEventListener('change', (event) => {
        state.sortMode =
          ((event.currentTarget as HTMLSelectElement).value as
            | 'recent'
            | 'engagement') || 'recent';
        render();
      });

    root.querySelectorAll<HTMLElement>('[data-open-replies]').forEach((button) => {
      button.addEventListener('click', async () => {
        const threadId = button.dataset.openReplies;
        if (!threadId) return;

        await toggleReplies(threadId);
      });
    });

    root.querySelectorAll<HTMLElement>('[data-toggle-post]').forEach((button) => {
      button.addEventListener('click', async () => {
        const threadId = button.dataset.togglePost;
        if (!threadId) return;

        if (state.expandedPostId === threadId) {
          state.expandedPostId = null;
          render();
          return;
        }

        state.expandedPostId = threadId;

        try {
          await loadReplies(threadId);
        } catch (error) {
          state.error = getCommunityErrorMessage(
            error,
            'Could not load replies for this post.',
          );
        }

        render();
      });
    });

    root
      .querySelectorAll<HTMLElement>('[data-toggle-all-replies]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const threadId = button.dataset.toggleAllReplies;
          if (!threadId) return;

          if (state.expandedReplyThreadIds.has(threadId)) {
            state.expandedReplyThreadIds.delete(threadId);
          } else {
            state.expandedReplyThreadIds.add(threadId);
          }

          render();
        });
      });

    root.querySelectorAll<HTMLElement>('[data-upvote-post]').forEach((button) => {
      button.addEventListener('click', async () => {
        const threadId = button.dataset.upvotePost;
        if (!threadId) return;

        await toggleVote(threadId);
      });
    });

    root.querySelectorAll<HTMLElement>('[data-share-post]').forEach((button) => {
      button.addEventListener('click', async () => {
        const threadId = button.dataset.sharePost;
        if (!threadId) return;

        const thread = state.threads.find((record) => record.id === threadId);
        if (!thread) return;

        await sharePost(thread);
      });
    });

    root.querySelectorAll<HTMLElement>('[data-report-post]').forEach((button) => {
      button.addEventListener('click', () => {
        const threadId = button.dataset.reportPost;
        if (!threadId) return;

        const thread = state.threads.find((record) => record.id === threadId);
        if (!thread) return;

        reportPost(thread);
      });
    });

    root.querySelectorAll<HTMLElement>('[data-delete-post]').forEach((button) => {
      button.addEventListener('click', async () => {
        const threadId = button.dataset.deletePost;
        if (!threadId) return;

        await deletePost(threadId);
      });
    });

    const postForm = root.querySelector<HTMLFormElement>('[data-post-form]');
    postForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!state.sessionUserId) return;

      state.error = '';
      state.info = '';
      render();

      const formData = new FormData(postForm);
      const title = String(formData.get('title') || '').trim();
      const category = String(formData.get('category') || '').trim();
      const body = String(formData.get('body') || '').trim();
      const isAnonymous = formData.get('isAnonymous') === 'on';
      const attachmentInput = postForm.querySelector<HTMLInputElement>(
        'input[name="attachment"]',
      );
      const attachmentFile = attachmentInput?.files?.[0] || null;
      const slug = `${slugifyPost(title)}-${Math.random()
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

        postForm.reset();
        state.composerOpen = false;
        state.info = attachment ? 'Post published with an attachment.' : 'Post published.';
        await syncState();
      } catch (error) {
        if (attachment?.path) {
          await removeCommunityAttachment(attachment.path);
        }

        state.error = getCommunityErrorMessage(
          error,
          'Could not publish post.',
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
        state.expandedPostId = threadId;
        state.info = 'Reply posted.';
        await loadReplies(threadId);
        await loadPosts();
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
