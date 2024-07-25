const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/createCourse', authenticateToken, courseController.createCourse);
router.get('/', authenticateToken, courseController.getAllCourses);
router.get('/:id', authenticateToken, courseController.getCourse);
router.post('/:id/videos', authenticateToken, courseController.addVideo);
router.delete('/:id', authenticateToken, courseController.deleteCourse);
router.delete('/:courseId/videos/:videoId', authenticateToken, courseController.deleteVideo);
router.put('/:id', authenticateToken, courseController.updateCourse);

module.exports = router;
