# Intercept Preview

A documentation and preview tool for QuestionPro's **Intercept** product — replacing the thin public help page
with something interactive, accurate, and verified against the actual product source.

Live at: https://pratik-ingole-qp.github.io/intercept-preview/

Based on [Bhavin Patil's original](https://github.com/bhavin-patil-qp/intercept-preview) — this copy's
Intercept tracking snippet in `index.html` uses its own API key and loads `loader.js` from a local Intercept
server at `http://localhost:8080`.

## What's here

- **Widget preview** — every intercept type (Pop-up, Feedback tab, Exit intent, Inline embed, Mobile prompt) drawn
  at the product's real pixel defaults, against sample sites, your own screenshot, or a live URL in a frame.
- **Targeting rules** — all 15 trigger rules, each with a plain-language explanation, a worked example, exact
  configuration, and the operands it actually supports.
- **Intercept settings** — configuration on the Intercept object itself (status, scheduling, matching order,
  sampling) and on its parent Project, including a worked example of the single-winner evaluation order.
- **Data mapping** — how visitor/site context gets attached to a survey response.
- **Visitor identity** — the actual cookie/localStorage mechanics behind "unique visitor," New vs. Returning, and
  the three visit-counting rules.
- **Setup** — creating an intercept, installing the snippet per platform, and a troubleshooting checklist.
- **Examples** — 12 real-world use cases tying a persona and goal to a concrete type + rule combination.

## Editing content

All the copy — every explanation, table, example, and cross-link — lives in a single file:
[`src/data.ts`](src/data.ts). Components are purely structural; they read from this file and render it. To change
what the site says, edit `data.ts`, commit, and push — the GitHub Actions workflow rebuilds and redeploys
automatically.

## Local development

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build (tsc -b && vite build)
npm run lint      # oxlint
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site
and publishes `dist/` to GitHub Pages via the official `actions/deploy-pages` action. No manual build/upload step
is needed — a push to `main` is a live deploy.

## A note on scope

Several claims here (widget pixel defaults, rule behavior, cookie mechanics, project/intercept settings) were
verified directly against the product's source rather than assumed from the existing help doc — where the doc and
the code disagreed, the code won, and the discrepancy is called out in the relevant section.
