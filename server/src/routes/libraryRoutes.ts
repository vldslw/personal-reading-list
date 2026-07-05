import { Router } from 'express';
import { getLibraryItems, addBookToLibrary, updateLibraryItem, removeBookFromLibrary } from '../controllers/libraryController.js';
import { mockAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// mock auth for now
router.use(mockAuth);

router.get('/', getLibraryItems);
router.post('/', addBookToLibrary);
router.put('/:id', updateLibraryItem);
router.delete('/:id', removeBookFromLibrary);

export default router;
