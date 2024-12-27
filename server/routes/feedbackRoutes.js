import express from "express";
import { Course } from "../models/Courses.js";
import { Feedback } from "../models/Feedback.js";
import axios from "axios"

const router = express.Router();

router.post('/analyze-sentiment', async (req, res) => {
    try {
        const { feedback } = req.body;

        // Call Flask microservice for sentiment analysis
        const sentimentResponse = await axios.post('https://customer-feedback-dashboard-b4wg.onrender.com/analyze_feedback', { feedback });

        return res.json(sentimentResponse.data);
    } catch (error) {
        console.error('Sentiment Analysis Error:', error);
        res.status(500).json({ error: 'Sentiment analysis failed' });
    }
});

router.post('/feedback', async (req, res) => {
    try {
        const { courseId, feedback } = req.body;

        if (!courseId || !feedback) {
            return res.status(400).json({ error: 'Missing courseId or feedback' });
        }

        // Analyze sentiments for each feedback section
        const analyzedFeedback = await Promise.all(
            Object.entries(feedback).map(async ([key, text]) => {
                const sentimentResponse = await axios.post(
                    'https://customer-feedback-dashboard-b4wg.onrender.com/analyze_feedback',
                    { feedback: text }
                ).catch(err => {
                    console.error(`Error analyzing feedback for section ${key}:`, err.message);
                    console.error(err.error);
                    throw new Error('Sentiment analysis failed');
                });

                return {
                    [key]: {
                        text,
                        sentiment: sentimentResponse.data.sentiment,
                        score: sentimentResponse.data.sentiment === 'happy' ? 3 :
                            (sentimentResponse.data.sentiment === 'neutral' ? 2 : 1)
                    }
                };
            })
        );

        // Combine analyzed feedback
        const combinedFeedback = analyzedFeedback.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        // Determine overall sentiment
        const sentimentScores = Object.values(combinedFeedback).map(item => item.score);
        const averageScore = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
        const overallSentiment = averageScore > 2.5 ? 'happy' :
            (averageScore > 1.5 ? 'neutral' : 'unhappy');

        // Create new feedback document
        const newFeedback = new Feedback({
            feedback: combinedFeedback,
            overallSentiment
        });

        // Save feedback and link to course
        await newFeedback.save();
        await Course.findByIdAndUpdate(courseId, { $push: { feedback: newFeedback._id } });

        res.status(201).json(newFeedback);
    } catch (error) {
        console.error('Feedback Save Error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to save feedback' });
    }
});


router.get('/course/:courseId/feedback', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('feedback');
        res.json(course.feedback);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
});

export default router;
