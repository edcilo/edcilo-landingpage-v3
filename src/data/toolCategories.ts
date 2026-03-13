import type { TranslationKey } from '../i18n/utils';

export interface Tool {
	name: string;
	href?: string;
}

export interface ToolCategory {
	titleKey: TranslationKey;
	slug: string;
	icon: string;
	tools: Tool[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
	{
		titleKey: 'devtools.category.encoders',
		slug: 'encoders',
		icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
		tools: [
			{ name: 'Base64', href: '/dev-tools/base64/' },
			{ name: 'URL', href: '/dev-tools/url-encoder/' },
			{ name: 'HTML Entity' },
			{ name: 'JWT' },
		],
	},
	{
		titleKey: 'devtools.category.converters',
		slug: 'converters',
		icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
		tools: [
			{ name: 'JSON \u2194 YAML' },
			{ name: 'Epoch \u2194 Date' },
			{ name: 'Hex \u2194 RGB' },
			{ name: 'Markdown \u2194 HTML' },
		],
	},
	{
		titleKey: 'devtools.category.formatters',
		slug: 'formatters',
		icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25',
		tools: [
			{ name: 'JSON' },
			{ name: 'SQL' },
			{ name: 'XML' },
			{ name: 'CSS' },
		],
	},
	{
		titleKey: 'devtools.category.generators',
		slug: 'generators',
		icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
		tools: [
			{ name: 'UUID' },
			{ name: 'Password' },
			{ name: 'Lorem Ipsum' },
			{ name: 'Hash' },
		],
	},
	{
		titleKey: 'devtools.category.textutils',
		slug: 'textutils',
		icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
		tools: [
			{ name: 'Diff' },
			{ name: 'Case Converter' },
			{ name: 'Regex Tester' },
			{ name: 'Word Counter' },
		],
	},
];
