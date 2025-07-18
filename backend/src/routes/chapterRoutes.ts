import express from 'express';
import { createChapter, deleteChapter, getChapterById, getChaptersByCourseId, markChapterAsComplete, reorderChapters, updateChapter } from '../controllers/chapterController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();


router.post("/", verifyToken, createChapter);
router.post('/:chapterId/complete', verifyToken, markChapterAsComplete);

router.get("/course/:courseId", verifyToken, getChaptersByCourseId);

router.patch("/reorder", verifyToken, reorderChapters);

router.get('/:chapterId', getChapterById);

router.patch("/update/:chapterId", verifyToken, updateChapter)
router.delete("/:id", verifyToken, deleteChapter);

export default router;