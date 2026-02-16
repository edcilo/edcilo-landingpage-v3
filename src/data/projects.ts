import type { TranslationKey } from '../i18n';

export interface Project {
	title: string;
	slug: string;
	descriptionKey: TranslationKey;
	url: string;
	cover: string;
	tech: string[];
}

export const PROJECTS: Project[] = [
	{
		title: 'Workshop Manager',
		slug: 'workshop-manager',
		descriptionKey: 'project.workshopManager.description',
		url: 'https://workshop.edcilo.com',
		cover: '/assets/portfolio/03_workshop.webp',
		tech: ['TypeScript', 'React', 'Next.js', 'AI', 'Tailwind'],
	},
	{
		title: 'Epoch Converter',
		slug: 'epoch-converter',
		descriptionKey: 'project.epochConverter.description',
		url: 'https://epoch.edcilo.com/',
		cover: '/assets/portfolio/01_epoch.webp',
		tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
	},
	{
		title: 'Password Generator',
		slug: 'password-generator',
		descriptionKey: 'project.passwordGenerator.description',
		url: 'https://www.passwordgenerator.cool/',
		cover: '/assets/portfolio/00_password.webp',
		tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
	},
	{
		title: 'Landing 2022',
		slug: 'landing-2022',
		descriptionKey: 'project.landing2022.description',
		url: 'https://edcilo.com/landing/2022',
		cover: '/assets/portfolio/02_landing_2022.webp',
		tech: ['HTML', 'CSS', 'Sass', 'Astro'],
	},
];
