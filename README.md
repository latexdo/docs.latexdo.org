# LatexDo Docs

This repository hosts the static documentation site for the LatexDo project at
`docs.latexdo.org`.

The docs are static, with browser behavior authored in TypeScript. Edit
`index.html`, `style.css`, and `src/site.ts`, then run:

```sh
npm install
npm run build
```

After that, open `index.html` in a browser. The content is based on these
sibling repositories:

- `/Users/omar/Desktop/Github/latexdo`
- `/Users/omar/Desktop/Github/latexdo.org`
- `/Users/omar/Desktop/Github/editor.latexdo.org`

When product behavior changes, update the docs in the same change or immediately
after syncing the downstream repositories.

## Deploy

Cloudflare Workers deployment is configured through `wrangler.jsonc`. Install
dependencies once, then deploy with:

```sh
npm install
npx wrangler deploy
```

Wrangler runs `npm run build` before publishing the static files from `dist/`.
In non-interactive environments, set `CLOUDFLARE_API_TOKEN` before deploying.
