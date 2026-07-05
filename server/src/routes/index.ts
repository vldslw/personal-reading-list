import { Router } from 'express';
import bookRoutes from './bookRoutes.js';

const router = Router();

// Health check: GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bookshelf API is running' });
});

router.use('/books', bookRoutes);

export default router;
