# The Princeton Journal

Astro site and Capacitor app shell for `theprincetonjournal.com`.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## AdSense notes

The global AdSense site script is installed in the shared layout for `theprincetonjournal.com`.

Manual placements are available through these optional environment variables:

- `PUBLIC_ADSENSE_HOME_SLOT`
- `PUBLIC_ADSENSE_ARTICLE_TOP_SLOT`
- `PUBLIC_ADSENSE_ARTICLE_BOTTOM_SLOT`

To enable those placements:

1. Copy `.env.example` to `.env`
2. Create the matching ad units in AdSense
3. Paste the slot IDs into `.env`
4. Rebuild or redeploy the site

Recommended setup:

- Keep Auto ads on for desktop side rails and general optimization
- Use the homepage slot between the hero/top sections
- Use the two article slots after the hero and near the end of articles
- Keep privacy, terms, contact, staff, subscribe, and registry-style utility pages ad-light or ad-free

## Capacitor app shell

This repo can generate a Capacitor-based iOS and Android app shell for The Princeton Journal.

The mobile app loads the live production site at `https://theprincetonjournal.com`, which means:

- site content updates appear in the app as soon as they are published
- store releases are only needed for native shell changes
- the app stays lighter than a fully custom native rebuild

Useful commands:

- `npm run app:add:ios`
- `npm run app:add:android`
- `npm run app:sync`
- `npm run app:open:ios`
- `npm run app:open:android`
- `npm run app:assets`

Notes:

- Xcode is still required to build/sign the iOS app
- Android Studio and a Java runtime are still required to build/sign the Android app
- app icon and splash assets are generated from files in `resources/`
- the live site drives the wrapped app, so web deploys affect in-app behavior too

## Community, accounts, and alerts

The repo now includes:

- `Account` page for sign-in, profile setup, and app-alert preferences
- article comments tied to TPJ accounts
- `Community` forum page with threads, replies, search, sorting, votes, and thread attachments
- support page and support prompts
- push-notification registration plumbing for the mobile app

To activate these features:

1. Create a Supabase project
2. Run the SQL in `supabase/migrations/20260410_tpj_platform_foundation.sql`
3. Run the SQL in `supabase/migrations/20260410_community_guardrails_and_uploads.sql`
4. Add these environment variables:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
5. Redeploy the site

Important note:

- the app-side notification UI is implemented
- actual production push delivery still needs Apple/APNs and Android/FCM credentials connected in the native apps
- for iPhone production distribution and push notifications, the paid Apple Developer membership is still required
- the second community migration creates a public `community-uploads` storage bucket with file-type and size guardrails for thread attachments
- profile rules now lock display names after account creation, limit username changes to once every 7 days, and allow anonymous handles to be updated freely

## Support links

The support page and article prompts use optional payment-link environment variables:

- `PUBLIC_SUPPORT_MONTHLY_URL`
- `PUBLIC_SUPPORT_YEARLY_URL`
- `PUBLIC_SUPPORT_ONE_TIME_URL`
- `PUBLIC_SUPPORT_FOUNDING_URL`

These can be Stripe Payment Links or any other checkout links you want to use.
