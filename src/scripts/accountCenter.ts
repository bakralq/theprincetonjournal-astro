import type { Session } from '@supabase/supabase-js';
import {
  defaultNotificationPreferences,
  ensureProfile,
  escapeHtml,
  getCommunityClient,
  getCommunitySetupMarkup,
  getPushPermissionSummary,
  hasCommunityBackend,
  loadNotificationPreferences,
  normalizeUsername,
  registerForPushNotifications,
  saveNotificationPreferences,
  type NotificationPreferences,
  type TPJProfile,
} from '../lib/community/client';

type AccountState = {
  loading: boolean;
  authMode: 'signin' | 'signup';
  session: Session | null;
  profile: TPJProfile | null;
  preferences: NotificationPreferences;
  error: string;
  info: string;
  permissionMessage: string;
};

const accountShell = (state: AccountState) => {
  if (state.loading) {
    return `
      <div class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p class="text-sm text-gray-500">Loading your account tools...</p>
      </div>
    `;
  }

  if (!state.session || !state.profile) {
    return `
      <section class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">TPJ Account</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-black">Create one account for comments, community, and app alerts.</h2>
          <p class="mt-4 text-base leading-7 text-gray-700">
            Your account powers article comments, the community forum, and notification preferences inside the TPJ app.
            You can still post anonymously when you want, but it stays attached to your account behind the scenes.
          </p>

          <div class="mt-6 inline-flex rounded-full border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              data-auth-mode="signin"
              class="${
                state.authMode === 'signin'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:text-black'
              } rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              Sign in
            </button>
            <button
              type="button"
              data-auth-mode="signup"
              class="${
                state.authMode === 'signup'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:text-black'
              } rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              Create account
            </button>
          </div>

          ${
            state.error
              ? `<div class="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">${escapeHtml(
                  state.error,
                )}</div>`
              : ''
          }

          ${
            state.info
              ? `<div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">${escapeHtml(
                  state.info,
                )}</div>`
              : ''
          }

          ${
            state.authMode === 'signin'
              ? `
                <form data-auth-form="signin" class="mt-6 space-y-4">
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      autocomplete="email"
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      autocomplete="current-password"
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="Your password"
                    />
                  </div>
                  <button
                    type="submit"
                    class="inline-flex items-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                  >
                    Sign in
                  </button>
                </form>
              `
              : `
                <form data-auth-form="signup" class="mt-6 space-y-4">
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Display name</label>
                    <input
                      name="displayName"
                      type="text"
                      minlength="2"
                      maxlength="40"
                      required
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      autocomplete="email"
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-semibold text-gray-700">Password</label>
                    <input
                      name="password"
                      type="password"
                      minlength="8"
                      required
                      autocomplete="new-password"
                      class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <button
                    type="submit"
                    class="inline-flex items-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
                  >
                    Create account
                  </button>
                </form>
              `
          }
        </div>

        <aside class="rounded-[2rem] border border-gray-200 bg-stone-50 p-6 sm:p-8">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">What your account unlocks</p>
          <ul class="mt-5 space-y-4 text-sm leading-7 text-gray-700">
            <li>Comment on stories with your name or an anonymous neighbor handle.</li>
            <li>Post and reply inside the TPJ community forum.</li>
            <li>Choose app alerts for new stories, tracker updates, registry updates, and weekly picks.</li>
            <li>Keep your community activity tied to one real account for accountability.</li>
          </ul>
          <div class="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
            <p class="text-sm font-semibold text-black">Want to support the reporting too?</p>
            <p class="mt-2 text-sm leading-6 text-gray-600">
              A TPJ support membership is separate from your account, but this is where member features will connect later.
            </p>
            <a
              href="/support"
              class="mt-4 inline-flex items-center rounded-2xl border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View support options
            </a>
          </div>
        </aside>
      </section>
    `;
  }

  const { profile, preferences } = state;

  return `
    <section class="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
      <div class="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Signed in</p>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-black">${escapeHtml(
              profile.display_name,
            )}</h2>
            <p class="mt-2 text-sm text-gray-600">${escapeHtml(
              state.session.user.email || '',
            )}</p>
          </div>
          <button
            type="button"
            data-sign-out
            class="rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
          >
            Sign out
          </button>
        </div>

        ${
          state.error
            ? `<div class="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">${escapeHtml(
                state.error,
              )}</div>`
            : ''
        }

        ${
          state.info
            ? `<div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">${escapeHtml(
                state.info,
              )}</div>`
            : ''
        }

        <form data-profile-form class="mt-6 space-y-5">
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">Display name</label>
            <input
              name="displayName"
              type="text"
              minlength="2"
              maxlength="40"
              required
              value="${escapeHtml(profile.display_name)}"
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">Username</label>
            <input
              name="username"
              type="text"
              minlength="3"
              maxlength="24"
              required
              value="${escapeHtml(profile.username)}"
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">Anonymous posting name</label>
            <input
              name="anonymousHandle"
              type="text"
              minlength="3"
              maxlength="24"
              required
              value="${escapeHtml(profile.anonymous_handle)}"
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
          <button
            type="submit"
            class="inline-flex items-center rounded-2xl border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Save account profile
          </button>
        </form>
      </div>

      <aside class="rounded-[2rem] border border-gray-200 bg-stone-50 p-6 sm:p-8">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">App alerts</p>
        <h3 class="mt-3 text-2xl font-bold tracking-tight text-black">Choose what TPJ sends you.</h3>
        <p class="mt-3 text-sm leading-7 text-gray-700">${escapeHtml(
          state.permissionMessage,
        )}</p>

        <div class="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            data-enable-push
            class="inline-flex items-center rounded-2xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Enable app notifications
          </button>
          <a
            href="/support"
            class="inline-flex items-center rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
          >
            Support TPJ
          </a>
        </div>

        <form data-notification-form class="mt-6 space-y-4 rounded-3xl border border-gray-200 bg-white p-5">
          ${notificationToggle(
            'new_articles',
            'New stories',
            'Get an alert whenever a new article goes live.',
            preferences.new_articles,
          )}
          ${notificationToggle(
            'tracker_updates',
            'City tracker updates',
            'Alerts for city council tracker updates and major agenda coverage.',
            preferences.tracker_updates,
          )}
          ${notificationToggle(
            'registry_updates',
            'Registry updates',
            'Only for fresh registry changes published by TPJ.',
            preferences.registry_updates,
          )}
          ${notificationToggle(
            'weekly_picks',
            'Weekly picks',
            'Occasional “read this older story” recommendations.',
            preferences.weekly_picks,
          )}
          <button
            type="submit"
            class="inline-flex items-center rounded-2xl border border-black px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            Save alert preferences
          </button>
        </form>
      </aside>
    </section>
  `;
};

const notificationToggle = (
  id: keyof NotificationPreferences,
  title: string,
  description: string,
  checked: boolean,
) => `
  <label class="flex items-start gap-3 rounded-2xl border border-gray-200 px-4 py-4">
    <input
      name="${id}"
      type="checkbox"
      class="mt-1 h-4 w-4 rounded border-gray-300"
      ${checked ? 'checked' : ''}
    />
    <span>
      <span class="block text-sm font-semibold text-black">${escapeHtml(title)}</span>
      <span class="mt-1 block text-sm leading-6 text-gray-600">${escapeHtml(
        description,
      )}</span>
    </span>
  </label>
`;

export const mountAccountCenter = (root: HTMLElement) => {
  if (root.dataset.mounted === 'true') return;
  root.dataset.mounted = 'true';

  if (!hasCommunityBackend()) {
    root.innerHTML = getCommunitySetupMarkup(
      'Accounts and community need a database connection.',
      'The auth UI, comments, forum, and alert preferences are ready in code, but they need Supabase keys and the database schema before they can go live.',
    );
    return;
  }

  const supabase = getCommunityClient();
  if (!supabase) return;

  const state: AccountState = {
    loading: true,
    authMode: 'signup',
    session: null,
    profile: null,
    preferences: defaultNotificationPreferences,
    error: '',
    info: '',
    permissionMessage: 'Checking notification support...',
  };

  const render = () => {
    root.innerHTML = accountShell(state);

    root.querySelectorAll<HTMLElement>('[data-auth-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        state.authMode =
          (button.dataset.authMode as 'signin' | 'signup') || 'signin';
        state.error = '';
        state.info = '';
        render();
      });
    });

    const signInForm = root.querySelector<HTMLFormElement>(
      '[data-auth-form="signin"]',
    );
    signInForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.error = '';
      state.info = '';
      render();

      const formData = new FormData(signInForm);
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        state.error = error.message;
        render();
      }
    });

    const signUpForm = root.querySelector<HTMLFormElement>(
      '[data-auth-form="signup"]',
    );
    signUpForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      state.error = '';
      state.info = '';
      render();

      const formData = new FormData(signUpForm);
      const displayName = String(formData.get('displayName') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/account',
          data: {
            display_name: displayName,
            username: displayName,
          },
        },
      });

      if (error) {
        state.error = error.message;
        render();
        return;
      }

      if (!data.session) {
        state.info =
          'Account created. Check your email if confirmation is enabled, then sign in here.';
        state.authMode = 'signin';
        render();
      }
    });

    const profileForm = root.querySelector<HTMLFormElement>('[data-profile-form]');
    profileForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!state.session || !state.profile) return;

      state.error = '';
      state.info = '';
      render();

      const formData = new FormData(profileForm);
      const displayName = String(formData.get('displayName') || '').trim();
      const username = String(formData.get('username') || '').trim();
      const anonymousHandle = String(formData.get('anonymousHandle') || '').trim();

      const normalizedUsername = normalizeUsername(username);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          username: normalizedUsername,
          anonymous_handle:
            anonymousHandle || state.profile.anonymous_handle,
        })
        .eq('id', state.session.user.id);

      if (profileError) {
        state.error = profileError.message;
        render();
        return;
      }

      await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          username: normalizedUsername,
          anonymous_handle:
            anonymousHandle || state.profile.anonymous_handle,
        },
      });

      state.info = 'Profile saved.';
      await syncState();
    });

    const notificationForm = root.querySelector<HTMLFormElement>(
      '[data-notification-form]',
    );
    notificationForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!state.session) return;

      state.error = '';
      state.info = '';
      render();

      const formData = new FormData(notificationForm);
      const nextPreferences: NotificationPreferences = {
        new_articles: formData.get('new_articles') === 'on',
        tracker_updates: formData.get('tracker_updates') === 'on',
        registry_updates: formData.get('registry_updates') === 'on',
        weekly_picks: formData.get('weekly_picks') === 'on',
      };

      try {
        await saveNotificationPreferences(state.session.user.id, nextPreferences);
        state.preferences = nextPreferences;
        state.info = 'Alert preferences saved.';
      } catch (error) {
        state.error =
          error instanceof Error ? error.message : 'Could not save preferences.';
      }

      render();
    });

    root.querySelector<HTMLElement>('[data-enable-push]')?.addEventListener(
      'click',
      async () => {
        if (!state.session) return;

        state.error = '';
        state.info = '';
        render();

        const result = await registerForPushNotifications(state.session.user.id);

        if (result.ok) {
          state.info = result.message;
        } else {
          state.error = result.message;
        }

        const permission = await getPushPermissionSummary();
        state.permissionMessage = permission.message;
        render();
      },
    );

    root.querySelector<HTMLElement>('[data-sign-out]')?.addEventListener(
      'click',
      async () => {
        await supabase.auth.signOut();
      },
    );
  };

  const syncState = async () => {
    state.loading = true;
    render();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      state.session = session;
      state.profile = session ? await ensureProfile(supabase, session) : null;
      state.preferences = session
        ? await loadNotificationPreferences(session.user.id)
        : defaultNotificationPreferences;

      const permission = await getPushPermissionSummary();
      state.permissionMessage = permission.message;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : 'Could not load account tools.';
    } finally {
      state.loading = false;
      render();
    }
  };

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(async () => {
      state.session = session;
      state.profile = session ? await ensureProfile(supabase, session) : null;
      state.preferences = session
        ? await loadNotificationPreferences(session.user.id)
        : defaultNotificationPreferences;
      state.error = '';
      state.info = session
        ? 'You are signed in and ready to comment, post, and manage alerts.'
        : 'Signed out.';

      const permission = await getPushPermissionSummary();
      state.permissionMessage = permission.message;
      state.loading = false;
      render();
    }, 0);
  });

  void syncState();

  window.addEventListener('beforeunload', () => {
    data.subscription.unsubscribe();
  });
};
