import type { ImageMetadata } from 'astro';
import type { TranslationKey } from '../i18n';

import coverLogographic from '../assets/portfolio/05_logographic.webp';
import coverMd2pdf from '../assets/portfolio/04_md2pdf.webp';
import coverWorkshop from '../assets/portfolio/03_workshop.webp';
import coverEpoch from '../assets/portfolio/01_epoch.webp';
import coverPassword from '../assets/portfolio/00_password.webp';
import coverLanding2022 from '../assets/portfolio/02_landing_2022.webp';

export interface Project {
	title: string;
	slug: string;
	descriptionKey: TranslationKey;
	url: string;
	cover: ImageMetadata;
	tech: string[];
}

export const PROJECTS: Project[] = [
	{
		title: 'Logographic Memory',
		slug: 'logographic-memory',
		descriptionKey: 'project.logographicMemory.description',
		url: 'https://logographic.edcilo.com',
		cover: coverLogographic,
		tech: ['TypeScript', 'React', 'Next.js', 'Mantine', 'Tailwind'],
	},
	{
		title: 'MD2PDF',
		slug: 'md2pdf',
		descriptionKey: 'project.md2pdf.description',
		url: 'https://md2pdf.edcilo.com/',
		cover: coverMd2pdf,
		tech: ['Astro', 'TypeScript', 'Tailwind'],
	},
	{
		title: 'Workshop Manager',
		slug: 'workshop-manager',
		descriptionKey: 'project.workshopManager.description',
		url: 'https://workshop.edcilo.com',
		cover: coverWorkshop,
		tech: ['TypeScript', 'React', 'Next.js', 'AI', 'Tailwind'],
	},
	{
		title: 'Epoch Converter',
		slug: 'epoch-converter',
		descriptionKey: 'project.epochConverter.description',
		url: 'https://epoch.edcilo.com/',
		cover: coverEpoch,
		tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
	},
	{
		title: 'Password Generator',
		slug: 'password-generator',
		descriptionKey: 'project.passwordGenerator.description',
		url: 'https://www.passwordgenerator.cool/',
		cover: coverPassword,
		tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
	},
	{
		title: 'Landing 2022',
		slug: 'landing-2022',
		descriptionKey: 'project.landing2022.description',
		url: 'https://edcilo.com/landing/2022',
		cover: coverLanding2022,
		tech: ['HTML', 'CSS', 'Sass', 'Astro'],
	},
];
