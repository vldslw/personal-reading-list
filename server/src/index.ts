import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectToDatabase } from './config/db.js';
import apiRoutes from './routes/index.js';

const app = express();

connectToDatabase().catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
