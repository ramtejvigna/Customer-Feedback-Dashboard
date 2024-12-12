import express from 'express';
import { Course } from '../models/Courses.js';

const router = express.Router();

// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new course
router.post('/courses', async (req, res) => {
    const course = new Course({
        courseName: req.body.courseName
    });

    try {
        const newCourse = await course.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get course with feedback
router.get('/course/:id/feedback', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('feedback');
        res.json(course.feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;