import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const configSchema = z.object({
  ninjaone: z.object({
    clientId: z.string().min(1, 'NINJAONE_CLIENT_ID is required'),
    clientSecret: z.string().min(1, 'NINJAONE_CLIENT_SECRET is required'),
    region: z.enum(['US', 'EU', 'AU']).default('US'),
    apiUrl: z.string().url().optional()
  }),
  server: z.object({
    port: z.number().int().positive().default(3000),
    logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info')
  }),
  rateLimiting: z.object({
    maxRequestsPerMinute: z.number().int().positive().default(60)
  })
});

// Build API URL based on region
function getApiUrl(region: string): string {
  const urls = {
    'US': 'https://api.ninjarmm.com',
    'EU': 'https://eu-api.ninjarmm.com',
    'AU': 'https://au-api.ninjarmm.com'
  };
  return urls[region as keyof typeof urls] || urls['US'];
}

export const config = configSchema.parse({
  ninjaone: {
    clientId: process.env.NINJAONE_CLIENT_ID,
    clientSecret: process.env.NINJAONE_CLIENT_SECRET,
    region: process.env.NINJAONE_REGION || 'US',
    apiUrl: process.env.NINJAONE_API_URL || getApiUrl(process.env.NINJAONE_REGION || 'US')
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    logLevel: process.env.LOG_LEVEL || 'info'
  },
  rateLimiting: {
    maxRequestsPerMinute: parseInt(process.env.RATE_LIMIT || '60', 10)
  }
});
