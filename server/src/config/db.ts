import { connect } from 'mongoose';
import { env } from './env.js';

export const connectToDatabase = async () => {
  await connect(env.mongoUri);
};
