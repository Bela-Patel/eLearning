const Course = require('../models/course');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const allowedTypes = ['video/mp4', 'video/mov'];
const maxFileSize = 50000 * 1024 * 1024; // 50M

//Add new course
exports.createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const videoFile = req.files.video;
        
        if (!allowedTypes.includes(videoFile.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type. Only MP4 and MOV are allowed.' });
        }
        if (videoFile.size > maxFileSize) {
            return res.status(400).json({ error: 'File size exceeds the maximum limit of 50MB.' });
        }
       
        const uploadPath = path.join(__dirname, '..', 'public', videoFile.name);

        videoFile.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to upload file.' });

            const video = {
                date: new Date(),
                filePath: videoFile.name
            };


            const newCourse = new Course({
                title,
                description,
                instructor: process.env.UserID,
                recordings: video,
                createdAt: Date.now()
            });

            await newCourse.save();
            res.status(200).send(newCourse);
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Server error' });
    }
};


//Get course details
exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'username');
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'name');
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Add video
exports.addVideo = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ error: 'Course not found' });
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const videoFile = req.files.video;

        if (!allowedTypes.includes(videoFile.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type. Only MP4 and MOV are allowed.' });
        }
        if (videoFile.size > maxFileSize) {
            return res.status(400).json({ error: 'File size exceeds the maximum limit of 50MB.' });
        }

        const uploadPath = path.join(__dirname, '..', 'public', videoFile.name);

        videoFile.mv(uploadPath, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to upload file.' });

            const video = {
                date: new Date(),
                filePath: videoFile.name
            };
            if(!course.recordings)
                course.recordings=[];
            course.recordings.push(video);
            await course.save();
            res.json(course.recordings);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) {
          return res.status(404).json({ error: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete Video
exports.deleteVideo = async (req, res) => {
    try {
        const { courseId, videoId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }
        
        const video = course.recordings.id(videoId);
        if (!video) {
          return res.status(404).json({ message: 'Video not found' });
        }
     
        const videoPath = path.join(__dirname, '..', 'public', path.basename(video.filePath));
        fs.unlink(videoPath, (err) => {
          if (err) {
            console.error('Error deleting video file:', err);
          }
        });
        course.recordings.pull(video)
        await course.save();
    
        res.json({ message: 'Video deleted successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
};