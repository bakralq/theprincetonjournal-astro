import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  type PermissionState,
} from '@capacitor/push-notifications';
import {
  createClient,
  type Session,
  type SupabaseClient,
} from '@supabase/supabase-js';

export type TPJProfile = {
  id: string;
  display_name: string;
  username: string;
  anonymous_handle: string;
  membership_tier?: string | null;
};

export type NotificationPreferences = {
  new_articles: boolean;
  tracker_updates: boolean;
  registry_updates: boolean;
  weekly_picks: boolean;
};

export const defaultNotificationPreferences: NotificationPreferences = {
  new_articles: true,
  tracker_updates: true,
  registry_updates: true,
  weekly_picks: false,
};

let supabaseClient: SupabaseClient | null = null;

export const hasCommunityBackend = () =>
  Boolean(
    import.meta.env.PUBLIC_SUPABASE_URL &&
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  );

export const getCommunityClient = () => {
  if (!hasCommunityBackend()) return null;

  if (!supabaseClient) {
    supabaseClient = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      },
    );
  }

  return supabaseClient;
};

export const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const normalizeUsername = (value: string) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);

  return normalized || `tpj_reader`;
};

export const createDefaultUsername = (value: string, userId: string) => {
  const suffix = userId.slice(0, 4).toLowerCase();
  const base = normalizeUsername(value)
    .replace(/^_+|_+$/g, '')
    .slice(0, 24 - suffix.length - 1);

  return `${base || 'tpj_reader'}_${suffix}`;
};

export const createAnonymousHandle = (userId: string) =>
  `Neighbor ${userId.slice(0, 4).toUpperCase()}`;

export const formatRelativeTime = (value: string) => {
  const date = new Date(value);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, amount] of ranges) {
    if (Math.abs(seconds) >= amount || unit === 'second') {
      return rtf.format(Math.round(seconds / amount), unit);
    }
  }

  return 'just now';
};

export const membershipBadge = (tier?: string | null) => {
  if (!tier || tier === 'reader') return '';

  const label = tier === 'founding' ? 'Founding member' : 'Supporter';
  return `<span class="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-900">${escapeHtml(
    label,
  )}</span>`;
};

export const getCommunitySetupMarkup = (title: string, body: string) =>
  `<div class="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm leading-7 text-gray-700">
    <p class="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Setup needed</p>
    <h3 class="mt-2 text-xl font-bold tracking-tight text-black">${escapeHtml(
      title,
    )}</h3>
    <p class="mt-3">${escapeHtml(body)}</p>
    <p class="mt-3 text-gray-500">Add <code>PUBLIC_SUPABASE_URL</code> and <code>PUBLIC_SUPABASE_ANON_KEY</code>, run the Supabase SQL in <code>supabase/migrations</code>, and redeploy.</p>
  </div>`;

export const getActiveSession = async () => {
  const supabase = getCommunityClient();
  if (!supabase) return { supabase: null, session: null, profile: null };

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const profile = session ? await ensureProfile(supabase, session) : null;
  return { supabase, session, profile };
};

export const ensureProfile = async (
  supabase: SupabaseClient,
  session: Session,
) => {
  const user = session.user;
  const { data: existingProfile, error: existingProfileError } = await supabase
    .from('profiles')
    .select('id, display_name, username, anonymous_handle, membership_tier')
    .eq('id', user.id)
    .maybeSingle();

  if (existingProfileError) throw existingProfileError;
  if (existingProfile) return existingProfile as TPJProfile;

  const emailLocal = user.email?.split('@')[0] || 'tpj-reader';
  const displayName =
    (user.user_metadata.display_name as string | undefined)?.trim() ||
    emailLocal;
  const username = createDefaultUsername(
    (user.user_metadata.username as string | undefined) || emailLocal,
    user.id,
  );
  const anonymousHandle =
    (user.user_metadata.anonymous_handle as string | undefined)?.trim() ||
    createAnonymousHandle(user.id);

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        display_name: displayName,
        username,
        anonymous_handle: anonymousHandle,
      },
      { onConflict: 'id' },
    )
    .select('id, display_name, username, anonymous_handle, membership_tier')
    .single();

  if (error) throw error;
  return data as TPJProfile;
};

export const loadNotificationPreferences = async (userId: string) => {
  const supabase = getCommunityClient();
  if (!supabase) return defaultNotificationPreferences;

  const { data, error } = await supabase
    .from('notification_preferences')
    .select(
      'new_articles, tracker_updates, registry_updates, weekly_picks',
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return defaultNotificationPreferences;
  }

  return {
    ...defaultNotificationPreferences,
    ...data,
  } as NotificationPreferences;
};

export const saveNotificationPreferences = async (
  userId: string,
  preferences: NotificationPreferences,
) => {
  const supabase = getCommunityClient();
  if (!supabase) return;

  const { error } = await supabase.from('notification_preferences').upsert(
    {
      user_id: userId,
      ...preferences,
    },
    { onConflict: 'user_id' },
  );

  if (error) throw error;
};

const getReadablePermission = (permission: PermissionState | undefined) => {
  if (permission === 'granted') return 'Notifications are enabled.';
  if (permission === 'denied') return 'Notifications are blocked for this app.';
  return 'Notifications have not been enabled yet.';
};

export const getPushPermissionSummary = async () => {
  if (!Capacitor.isNativePlatform()) {
    return {
      supported: false,
      message: 'Push permissions are only available in the mobile app.',
    };
  }

  try {
    const permissions = await PushNotifications.checkPermissions();
    return {
      supported: true,
      message: getReadablePermission(permissions.receive),
    };
  } catch {
    return {
      supported: true,
      message: 'Push permissions are not ready yet on this device.',
    };
  }
};

export const registerForPushNotifications = async (userId: string) => {
  if (!Capacitor.isNativePlatform()) {
    return {
      ok: false,
      message: 'Push notifications only work inside the mobile app.',
    };
  }

  let permissions = await PushNotifications.checkPermissions();
  if (permissions.receive === 'prompt') {
    permissions = await PushNotifications.requestPermissions();
  }

  if (permissions.receive !== 'granted') {
    return {
      ok: false,
      message: 'Notification permission was not granted.',
    };
  }

  const supabase = getCommunityClient();
  if (!supabase) {
    return {
      ok: false,
      message: 'Community backend is not configured yet.',
    };
  }

  return await new Promise<{ ok: boolean; message: string }>(
    async (resolve) => {
      let settled = false;

      const finish = async (result: { ok: boolean; message: string }) => {
        if (settled) return;
        settled = true;
        await registrationListener.remove();
        await errorListener.remove();
        resolve(result);
      };

      const registrationListener = await PushNotifications.addListener(
        'registration',
        async (token) => {
          try {
            const { error } = await supabase.from('push_subscriptions').upsert(
              {
                user_id: userId,
                token: token.value,
                platform: Capacitor.getPlatform(),
              },
              { onConflict: 'token' },
            );

            if (error) throw error;

            await finish({
              ok: true,
              message: 'Notifications are enabled for this account.',
            });
          } catch (error) {
            await finish({
              ok: false,
              message:
                error instanceof Error
                  ? error.message
                  : 'Could not save the push subscription.',
            });
          }
        },
      );

      const errorListener = await PushNotifications.addListener(
        'registrationError',
        async (error) => {
          await finish({
            ok: false,
            message:
              error.error || 'The app could not register for notifications.',
          });
        },
      );

      window.setTimeout(() => {
        void finish({
          ok: false,
          message: 'Timed out while registering this device for notifications.',
        });
      }, 9000);

      await PushNotifications.register();
    },
  );
};
