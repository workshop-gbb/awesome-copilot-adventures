---
title: Multilingual site and publishing
permalink: /site-publishing/
last_verified: "2026-09-07"
---

# Multilingual site and publishing

## Architecture

The site uses **Astro 7.2.9**, static output and build-time content collections.
Canonical lessons stay in their curriculum directories. Content-addressed
translation dictionaries provide complete Spanish and Brazilian Portuguese prose;
English uses the canonical source.

The generator creates temporary Markdown, search indexes, the source inventory and
static assets in `site-generated/`. Astro renders the final pages into `dist/`.
Neither directory is committed. No runtime translation service, model API, Ruby,
Jekyll or database is required.

## Language and source policy

Every current learning document has `/en/`, `/es/` and `/pt-br/` routes. Navigation,
search, document titles, diagram labels and instructional prose use the selected
language. Heading anchors stay stable across languages. Missing translations fail
the build instead of silently showing English.

Commands, sample prompts, source code, identifiers and exact data stay original so
the exercises remain reproducible. Licenses, machine-consumed customizations and
historical documents are preserved as original sources with a localized notice.
The repository explorer indexes all public source files, excluding generated
output, ignored local state and dependencies.

Original downloads are content-addressed and checked against SHA-256. Text line
endings follow the repository's `.gitattributes` rule; binary bytes are unchanged.
Source text is displayed as text, never executed as HTML or JavaScript.

## Learner archives

The [download catalog](downloads.md) links to 35 exercise ZIPs under
`assets/lab-kits/`. Unlike individual source previews, these links resolve to
static download files in every locale. Packages contain learner fixtures, a lesson
snapshot, local images, setup guidance, licenses and file-integrity manifests;
instructor reference directories and local caches are excluded.

After changing a packaged source, lesson, image or setup guide, run:

```bash
npm run build:kits
npm run test:kits
npm run check:kits
```

Commit the regenerated ZIPs and checksum inventory alongside their source changes.
Repository tests and site builds reject stale archives. Package tests do not claim
that an authenticated model, cloud session or every language adaptation ran.

## Local verification

Use Node.js 24 or newer with the checked-in lockfile. Install dependencies only
after cloning or changing dependency manifests.

```bash
npm ci --ignore-scripts
npm test
npm run build:site
npm run check:astro
npm run check:site:rendered -- dist
npm run preview:site -- --host 127.0.0.1
```

Open the URL printed by the preview command, including the project base path.
Check desktop and mobile layouts, keyboard navigation, search, theme controls,
same-document language switching, source previews/downloads and monochrome diagrams.
Static links and every search result are also checked against rendered output.

For live editing, use `npm run dev:site`. Canonical content or translation changes
require restarting that command so the publication input is regenerated. Do not
edit generated Markdown directly.

## Work-drive and resource limits

Keep the checkout, output, browser profile and package caches on the selected work
drive. `SITE_OUTPUT_DIR` can override the output directory. `TMPDIR`,
`npm_config_cache` and `XDG_CACHE_HOME` control temporary/cache locations.

The default build uses one page-rendering worker and one Rust worker. The CLI wrapper
disables Astro telemetry and defaults to a 768 MiB Node heap ceiling when
`NODE_OPTIONS` is not already set. This is a process limit, not a guarantee about
total machine memory. Do not start load tests, parallel browsers or multiple builds
on a shared computer.

## Publication

The [Pages workflow](../.github/workflows/pages.yml) installs locked dependencies,
runs repository checks, builds Astro, checks component types and verifies rendered
links before uploading the static artifact. Deployment uses the `github-pages`
environment. Configure **Settings → Pages → Source → GitHub Actions**.

Only pushes to `main` and manual runs deploy; pull requests validate without
publishing. Repository owner, site origin, base path, locales and Mermaid version
are centralized in [site configuration](../site.config.json). Update them after a
repository transfer and verify the resulting public URL.

Old curriculum routes redirect to their English equivalents, preserving query
parameters and heading fragments. GitHub does not guarantee redirection from a
previous owner's Pages hostname; update bookmarks to the current site address.

## Translation maintenance

Run the translation exporter with an absolute directory on the selected work
drive. It emits bounded JSON work packets without calling an external service.
Translate each segment without changing link targets, code spans, Markdown
structure or product facts. Store reviewed output under `site-locales/es/` and
`site-locales/pt-br/`.

Segment IDs derive from source text. Editing a paragraph requires a new translation
for that paragraph. The build validates all required IDs, protected code/link
tokens, heading structure and monochrome diagram requirements.

## Official references

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro internationalization](https://docs.astro.build/en/guides/internationalization/)
- [Astro deployment to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
