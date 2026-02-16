export const DEFAULT_LOCALE = 'es';
export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
