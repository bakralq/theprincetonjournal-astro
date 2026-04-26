import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    publishedAt: z.string().optional(),
    section: z.string(),
    author: z.string(),
    image: z.string().optional(),
    imageCaption: z.string().optional(),
    imageCaptionUrl: z.string().url().optional(),
    imageFit: z.enum(['cover', 'contain']).optional(),
    cardImageFit: z.enum(['cover', 'contain']).optional(),
    topStoryImageLayout: z.enum(['default', 'square']).optional(),
    heroWide: z.boolean().optional(),
    heroSize: z.enum(['default', 'compact']).optional(),
    cardImageHeight: z.enum(['default', 'tall']).optional(),
    readingTime: z.number().int().positive().optional(),
    preview: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
};
