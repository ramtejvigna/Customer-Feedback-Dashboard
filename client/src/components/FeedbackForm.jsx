import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, BookOpen, Library, Construction, ThumbsUp, ChevronLeft, ChevronRight, Send } from 'lucide-react';

const FeedbackForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { courseId, courseName } = location.state;
    const [currentPage, setCurrentPage] = useState(1);

    const feedbackSections = [
        {
            id: 'courseExpertise',
            title: 'Instructor Expertise',
            icon: <Star className="w-6 h-6" />,
            questions: [
                'How would you rate the instructor\'s knowledge?',
                'How effective was the teaching methodology?',
                'How well were doubts addressed?'
            ]
        },
        {
            id: 'courseContents',
            title: 'Course Content',
            icon: <BookOpen className="w-6 h-6" />,
            questions: [
                'How relevant was the course material?',
                'How well-structured was the content?',
                'How practical were the assignments?'
            ]
        },
        {
            id: 'labInfrastructure',
            title: 'Laboratory Infrastructure',
            icon: <Construction className="w-6 h-6" />,
            questions: [
                'How well-equipped were the labs?',
                'How maintained were the equipment?',
                'How accessible were the facilities?'
            ]
        },
        {
            id: 'libraryFacility',
            title: 'Library Resources',
            icon: <Library className="w-6 h-6" />,
            questions: [
                'How comprehensive was the book collection?',
                'How helpful was the library staff?',
                'How conducive was the study environment?'
            ]
        }
    ];

    const [feedback, setFeedback] = useState(
        feedbackSections.reduce((acc, section) => ({
            ...acc,
            [section.id]: Array(section.questions.length).fill('').join(', ')
        }), {})
    );
    

    const [sentiments, setSentiments] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (sectionId, questionIdx, value) => {
        setFeedback(prev => {
            const currentValues = prev[sectionId].split(', ');
            currentValues[questionIdx] = value;
            return {
                ...prev,
                [sectionId]: currentValues.join(', ')
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log(feedback)
            const response = await axios.post('https://customer-feedback-backend-one.vercel.app/feedback', {
                courseId,
                courseName,
                feedback
            });
            setSentiments(response.data.feedback);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setIsSubmitting(false);
            // navigate('/');
        }
    };

    const currentSection = feedbackSections[currentPage - 1];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6"
        >
            <motion.div 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h2 className="text-3xl font-bold">Course Feedback</h2>
                    <p className="opacity-90 mt-2">Providing feedback for: <span className='font-semibold text-xl'>{courseName}</span></p>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                {currentSection.icon}
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    {currentSection.title}
                                </h3>
                            </div>

                            {currentSection.questions.map((question, idx) => (
                                <motion.div
                                    key={`${currentSection.id}-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="space-y-2"
                                >
                                    <label className="block text-gray-700 font-medium">
                                        {question}
                                    </label>
                                    <textarea
                                        value={feedback[currentSection.id].split(', ')[idx]}
                                        onChange={(e) => handleChange(currentSection.id, idx, e.target.value)}
                                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 transition-all duration-200 resize-none"
                                        rows="3"
                                        placeholder="Share your thoughts..."
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center mt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400' 
                                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5" /> Previous
                        </motion.button>

                        <div className="flex gap-2">
                            {feedbackSections.map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`w-3 h-3 rounded-full ${
                                        currentPage === idx + 1 
                                            ? 'bg-purple-600' 
                                            : 'bg-purple-200'
                                    }`}
                                    whileHover={{ scale: 1.2 }}
                                />
                            ))}
                        </div>

                        {currentPage === feedbackSections.length ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
                            >
                                {isSubmitting ? (
                                    'Submitting...'
                                ) : (
                                    <>
                                        Submit <Send className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(prev => Math.min(feedbackSections.length, prev + 1))}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                            >
                                Next <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FeedbackForm;