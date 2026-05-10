const DEFAULT_TARGET_URL =
  'https://script.google.com/macros/s/AKfycbxbfz1bDo42bUl70cmrsiLsMvyr_cVubkO0Wl1uWNIVyFTT21BGTGAc8wO83qYTpxWT/exec?key=ccj-newsletter-sync-2026-private';

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

const getTargetUrl = () =>
  process.env.NEWSLETTER_APPS_SCRIPT_URL || DEFAULT_TARGET_URL;

const isAuthorized = (request) => {
  const relaySecret = process.env.NETLIFY_FORM_RELAY_SECRET;
  if (!relaySecret) return true;

  const url = new URL(request.url);
  return url.searchParams.get('key') === relaySecret;
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json(200, { ok: true, skipped: true, reason: 'Only POST requests are relayed.' });
  }

  if (!isAuthorized(request)) {
    return json(200, { ok: false, forwarded: false, error: 'Unauthorized relay request.' });
  }

  const targetUrl = getTargetUrl();
  const body = await request.text();
  const contentType = request.headers.get('content-type') || 'application/json';

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body,
      redirect: 'manual',
    });

    return json(200, {
      ok: true,
      forwarded: true,
      targetStatus: response.status,
      targetRedirected: response.status >= 300 && response.status < 400,
    });
  } catch (error) {
    return json(200, {
      ok: false,
      forwarded: false,
      error: String(error && error.message ? error.message : error),
    });
  }
}
