import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.join(import.meta.dirname, '../../.env'),
});

const requiredKeys = ['MONGO_URI'] as const;

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 5001),
  mongoUri: process.env.MONGO_URI as string,
};
