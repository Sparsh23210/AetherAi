import { z } from 'zod';

export const toolSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
  short_description: z.string().max(200).optional(),
  website_url: z.string().url(),
  pricing_type: z.enum(['Free', 'Freemium', 'Paid', 'Paid API']),
  api_available: z.boolean().default(false),
  mobile_app: z.boolean().default(false),
  desktop_app: z.boolean().default(false),
  web_app: z.boolean().default(true),
  quality_score: z.number().min(1).max(10).optional(),
  speed_score: z.number().min(1).max(10).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
  icon: z.string().optional(),
});
