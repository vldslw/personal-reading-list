import { Router } from 'express';
import bookRoutes from './bookRoutes.js';
import shelfRoutes from './shelfRoutes.js';
import libraryRoutes from './libraryRoutes.js';

const router = Router();

// Health check: GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bookshelf API is running' });
});

router.use('/books', bookRoutes);
router.use('/shelves', shelfRoutes);
router.use('/library', libraryRoutes);

export default router;
