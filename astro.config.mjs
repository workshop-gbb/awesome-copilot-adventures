import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { stableHeadingAnchors } from './scripts/heading-anchors.mjs';
import settings from './site.config.json' with { type: 'json' };

export default defineConfig({
  site: settings.site,
  base: settings.base,
  srcDir: './site',
  publicDir: './site-generated/public',
  outDir: process.env.SITE_OUTPUT_DIR || './dist',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', concurrency: 1 },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt-br'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }
  },
  markdown: {
    processor: satteri({ hastPlugins: [stableHeadingAnchors()] }),
    syntaxHighlight: false
  },
  vite: { server: { strictPort: true }, preview: { strictPort: true } },
  devToolbar: { enabled: false }
});
