const express = require('express');
const router = express.Router();
const auth = require('../routes/auth');
const Course = require('../models/course');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name');
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (only instructors can create)
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;

    try {
        const newCourse = new Course({
            title,
            description,
            instructor: req.user.id
        });

        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/courses/:id
// @desc    Update course by ID
// @access  Private (only instructors can update)
router.put('/:id', auth, async (req, res) => {
    const { title, description } = req.body;

    const courseFields = {};
    if (title) courseFields.title = title;
    if (description) courseFields.description = description;

    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is course instructor
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: courseFields },
            { new: true }
        );

        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course by ID
// @access  Private (only instructors can delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if user is course instructor
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Course.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
