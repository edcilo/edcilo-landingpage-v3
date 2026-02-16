export interface SkillGroup {
	language: string;
	frameworks: string[];
}

export interface SkillCategory {
	title: string;
	slug: string;
	icon: string;
	skills?: string[];
	groups?: SkillGroup[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
	{
		title: 'Backend',
		slug: 'backend',
		icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z',
		groups: [
			{ language: 'Go', frameworks: ['Fiber'] },
			{ language: 'Python', frameworks: ['Flask', 'FastAPI', 'Django'] },
			{
				language: 'JavaScript',
				frameworks: ['Node', 'Deno', 'Express', 'Astro'],
			},
			{ language: 'PHP', frameworks: ['Laravel'] },
		],
	},
	{
		title: 'Frontend',
		slug: 'frontend',
		icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
		skills: [
			'HTML',
			'CSS',
			'Tailwind',
			'Sass',
			'JavaScript',
			'TypeScript',
			'React',
			'Vue',
			'Next.js',
		],
	},
	{
		title: 'Databases',
		slug: 'databases',
		icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125v-3.75',
		skills: ['Postgres', 'MySQL', 'MongoDB', 'Redis'],
	},
	{
		title: 'SRE / DevOps',
		slug: 'sre',
		icon: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z',
		skills: ['Docker', 'Kubernetes', 'AWS'],
	},
];
