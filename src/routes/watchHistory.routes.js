import express from 'express';
import { addVideoToWatchHistory, getWatchHistory, clearWatchHistory } from '../controllers/watchHistory.controller.js';

const router = express.Router();

router.post('/:videoId/:userId', addVideoToWatchHistory);
router.get('/',  getWatchHistory);
router.delete('/',  clearWatchHistory);

export default router;
