# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

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
