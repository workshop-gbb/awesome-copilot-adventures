import generated from '../../site-generated/site.json';
import labels from '../../scripts/site-ui.json';
import settings from '../../site.config.json';

export type Locale = 'en' | 'es' | 'pt-br';
export type Labels = typeof labels.en;
export interface DocumentInfo {
  title: string;
  url: string;
  source: string;
  group: string;
  route: string;
  labId: string;
}
export interface Language {
  ui: Labels;
  catalog: DocumentInfo[];
  href: Record<string, string>;
}
export interface PageInfo {
  locale: Locale;
  title: string;
  route: string;
  alternates: Record<string, string>;
  source?: string;
  group?: string;
  verified?: string;
  home?: boolean;
  kind?: 'document' | 'repository' | 'library' | 'not-found';
}

const languages: Partial<Record<Locale, Language>> = generated.locales;
export const locales: Locale[] = ['en', 'es', 'pt-br'];
export const activeLocales = locales.filter(locale => languages[locale]);
export const counts = generated;
export { settings };

export function languageFor(locale: Locale): Language {
  const language = languages[locale];
  if (!language) throw new Error(`The build has no content for locale ${locale}.`);
  return language;
}

export function labelFor(locale: Locale, key: string): string {
  const ui: Record<string, string> = labels[locale];
  if (!(key in ui)) throw new Error(`Unknown UI label: ${locale}/${key}`);
  return ui[key];
}

export function alternateUrls(route: string): Record<string, string> {
  return Object.fromEntries(locales.map(locale => [locale, `${settings.base}/${locale}${route}`]));
}
