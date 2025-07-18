import express from 'express';
import { createCourse, getCourseById, updateCourse,getAllCategories, createAttachment, getPublishedCourses, getPublishedCourseDetail, search, getMyCourses, deleteCourse } from '../controllers/courseController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', verifyToken, createCourse);
router.get("/published", getPublishedCourses);

router.get("/search", search);
router.get('/getCourses', verifyToken, getMyCourses);
router.delete('/deleteCourse/:id', verifyToken, deleteCourse);

router.get('/category',verifyToken, getAllCategories);
router.patch('/:courseId', verifyToken, updateCourse);
router.get("/:courseId/detail", getPublishedCourseDetail);

router.get('/:id', verifyToken, getCourseById);
router.post('/attachments', verifyToken, createAttachment);

export default router;
