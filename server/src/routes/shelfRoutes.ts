import { Router } from 'express';
import { getShelves, createShelf, updateShelf, deleteShelf } from '../controllers/shelfController.js';
import { mockAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// mock auth for now
router.use(mockAuth);

router.get('/', getShelves);
router.post('/', createShelf);
router.put('/:id', updateShelf);
router.delete('/:id', deleteShelf);

export default router;
