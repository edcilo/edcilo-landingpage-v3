import { UI_STRINGS } from './ui';
import { DEFAULT_LOCALE } from './config';
import type { Locale } from './config';

export type TranslationKey = keyof (typeof UI_STRINGS)[typeof DEFAULT_LOCALE];

export function useTranslations(locale: string) {
	const lang = (locale in UI_STRINGS ? locale : DEFAULT_LOCALE) as Locale;
	return function t(key: TranslationKey): string {
		return UI_STRINGS[lang][key] ?? UI_STRINGS[DEFAULT_LOCALE][key];
	};
}

export function getLocalizedPath(path: string, locale: string): string {
	if (locale === DEFAULT_LOCALE) return path;
	// If path starts with /, prepend locale
	if (path.startsWith('/')) return `/${locale}${path}`;
	return `/${locale}/${path}`;
}

export function getDateLocale(locale: string): string {
	return locale === 'es' ? 'es-MX' : 'en-US';
}
