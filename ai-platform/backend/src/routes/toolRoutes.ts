import express from 'express';
import { getTools, getToolBySlug, deleteTool, updateTool } from '../controllers/toolController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', getTools);
router.get('/:slug', getToolBySlug);
router.delete('/:id', protect, deleteTool);
router.put('/:id', protect, updateTool);

export default router;
