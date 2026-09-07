import type { APIRoute } from 'astro';
import { activeLocales, languageFor, settings, alternateUrls } from '../lib/catalog';

function escapeXml(text: string): string {
  return text.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[character] || character));
}

export const GET: APIRoute = () => {
  const entries: string[] = [];
  for (const locale of activeLocales) {
    const urls = [...languageFor(locale).catalog.map(document => document.url), `${settings.base}/${locale}/library/`, `${settings.base}/${locale}/repository/`];
    for (const url of urls) {
      const route = url.slice(`${settings.base}/${locale}`.length);
      const alternates = Object.entries(alternateUrls(route)).map(([language, href]) =>
        `<xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(settings.site + href)}"/>`).join('');
      entries.push(`<url><loc>${escapeXml(settings.site + url)}</loc>${alternates}</url>`);
    }
  }
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
