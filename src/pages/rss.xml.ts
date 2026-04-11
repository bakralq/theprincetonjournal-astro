import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostDateObject, getPostTimestamp } from '../lib/posts';

export async function GET(context: { site?: URL }) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const sortedPosts = posts.sort(
    (a, b) =>
      getPostTimestamp({ date: b.data.date, publishedAt: b.data.publishedAt }) -
      getPostTimestamp({ date: a.data.date, publishedAt: a.data.publishedAt })
  );

  return rss({
    title: 'The Princeton Journal',
    description: 'Princeton’s leading source for local news, governance coverage, and community reporting.',
    site: context.site?.toString() || 'https://theprincetonjournal.com',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: getPostDateObject({
        date: post.data.date,
        publishedAt: post.data.publishedAt,
      }),
      link: `/posts/${post.id.replace(/\.md$/, '')}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
