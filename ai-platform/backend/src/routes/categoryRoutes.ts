import express from 'express';
import { getCategories, createCategory, linkToolToCategory } from '../controllers/categoryController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);
router.post('/:id/link', protect, adminOnly, linkToolToCategory);

export default router;
