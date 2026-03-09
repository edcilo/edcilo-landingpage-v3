import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getReadingTime } from '../../utils/readingTime';

export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);

	const index = posts.map((post) => ({
		title: post.data.title,
		description: post.data.description,
		date: post.data.date.toISOString(),
		tags: post.data.tags,
		slug: post.id,
		readingTime: getReadingTime(post.body ?? ''),
	}));

	return new Response(JSON.stringify(index), {
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
