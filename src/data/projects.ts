export interface Project {
	title: string;
	slug: string;
	description: string;
	url: string;
	cover: string;
	tech: string[];
}

export const PROJECTS: Project[] = [
	{
		title: 'Workshop Manager',
		slug: 'workshop-manager',
		description:
			'A full-featured web app to manage auto repair shops — repair orders, inventory, POS, and an AI-powered chat assistant.',
		url: 'https://workshop.edcilo.com',
		cover: '/assets/portfolio/03_workshop.webp',
		tech: ['TypeScript', 'React', 'Next.js', 'AI', 'Tailwind'],
	},
	{
		title: 'Epoch Converter',
		slug: 'epoch-converter',
		description:
			'A simple epoch converter that translates epoch time to human-readable time.',
		url: 'https://epoch.edcilo.com/',
		cover: '/assets/portfolio/01_epoch.webp',
		tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
	},
	{
		title: 'Password Generator',
		slug: 'password-generator',
		description:
			'A straightforward password generator that lets you choose the length and character types.',
		url: 'https://www.passwordgenerator.cool/',
		cover: '/assets/portfolio/00_password.webp',
		tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
	},
	{
		title: 'Landing 2022',
		slug: 'landing-2022',
		description: 'A personal landing page built for the year 2022.',
		url: 'https://edcilo.com/landing/2022',
		cover: '/assets/portfolio/02_landing_2022.webp',
		tech: ['HTML', 'CSS', 'Sass', 'Astro'],
	},
];
