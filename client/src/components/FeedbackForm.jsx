import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedbackForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const courseId = location.state.courseId;

    const [feedback, setFeedback] = useState({
        courseExpertise: '',
        courseContents: '',
        labInfrastructure: '',
        libraryFacility: ''
    });
    const [sentiments, setSentiments] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedback(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Submit feedback to backend
            const response = await axios.post('http://localhost:3000/feedback', {
                courseId: courseId,
                feedback
            });

            setSentiments(response.data.feedback);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewDashboard = () => {
        navigate('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-6"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Course Feedback Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {Object.keys(feedback).map((field) => (
                        <motion.div
                            key={field}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                        >
                            <label className="block text-gray-700 mb-2 capitalize">
                                {field.replace(/([A-Z])/g, ' $1')}
                            </label>
                            <textarea
                                name={field}
                                value={feedback[field]}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition resize-none"
                                rows="3"
                                placeholder={`Enter your feedback about ${field.replace(/([A-Z])/g, ' $1')}`}
                            />
                            {sentiments[field] && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`absolute top-0 right-0 px-3 py-1 rounded-full text-xs font-bold 
                                        ${sentiments[field].sentiment === 'happy' ? 'bg-green-200 text-green-800' :
                                            sentiments[field].sentiment === 'neutral' ? 'bg-yellow-200 text-yellow-800' :
                                                'bg-red-200 text-red-800'}`}
                                >
                                    {sentiments[field].sentiment}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-lg text-white font-bold transition ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                            }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </motion.button>
                </form>
                {isSubmitted && (
                    <motion.button
                        type="button"
                        onClick={handleViewDashboard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 mt-4 rounded-lg text-white font-bold bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transition"
                    >
                        View Dashboard
                    </motion.button>
                )}
            </motion.div>
        </motion.div>
    );
};

export default FeedbackForm;