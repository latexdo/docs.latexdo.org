# docs.latexdo.org

This repository hosts the public LatexDo documentation site at `https://docs.latexdo.org`. It is a static documentation site with TypeScript-powered browser behavior.

## Repository Role

- Documents the LatexDo desktop app, local CLI, public website, hosted editor, release flow, and maintenance workflow.
- Serves a static documentation site from `index.html`, `style.css`, and `site.js`.
- Deploys to Cloudflare Workers assets through Wrangler.

## Requirements

- Node.js 20 or newer.
- npm.
- Wrangler for deploys and Worker previews.

## Run Locally

```sh
npm install
npm run build
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`. The build compiles `src/site.ts` to `site.js` and prepares `dist/` for Cloudflare deploys.

For a Wrangler preview:

```sh
npm run preview
```

## Common Commands

```sh
npm run build      # Compile TypeScript and prepare dist/.
npm run typecheck  # Check TypeScript without emitting files.
npm run preview    # Run Wrangler dev locally.
npm run deploy     # Deploy with Wrangler.
```

## Deploy

```sh
npx wrangler deploy
```