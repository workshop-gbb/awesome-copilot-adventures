import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './site-generated/content',
    deferRender: true
  }),
  schema: z.object({
    locale: z.enum(['en', 'es', 'pt-br']),
    title: z.string().min(1),
    route: z.string().startsWith('/'),
    source: z.string().min(1),
    group: z.enum(['adventures', 'hands-on', 'guides', 'fixtures', 'solutions', 'media']),
    verified: z.string(),
    home: z.boolean(),
    alternates: z.record(z.string(), z.string())
  })
});

export const collections = { lessons };
