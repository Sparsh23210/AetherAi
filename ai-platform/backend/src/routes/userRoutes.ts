import express from 'express';
import { saveUserPreferences } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/preferences', protect, saveUserPreferences);

export default router;
