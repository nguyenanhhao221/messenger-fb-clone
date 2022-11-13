import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL)
  throw new Error('Redis URL is not valid, please double check your .env file');
export const client = new Redis(REDIS_URL);
