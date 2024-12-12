import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ courseName: '' });
    const [feedbackData, setFeedbackData] = useState([]);
    const navigate = useNavigate();

    // Fetch Courses (existing code remains the same)
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            }
        };
        fetchCourses();
    }, []);

    // Add Course Handler (existing code remains the same)
    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/courses', newCourse);
            setCourses([...courses, response.data]);
            setNewCourse({ courseName: '' });
        } catch (error) {
            console.error('Failed to add course', error);
        }
    };

    // Navigation to Feedback Form
    const handleGiveFeedback = (courseId) => {
        navigate(`/feedback`, {
            state: {
                courseId: courseId
            }
        });
    };

    // Fetch Feedback Data for Charts (existing code remains the same)
    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                const sentimentData = await Promise.all(
                    courses.map(async (course) => {
                        const response = await axios.get(`http://localhost:3000/course/${course._id}/feedback`);
                        return {
                            courseName: course.courseName,
                            happy: response.data.filter(f => f.overallSentiment === 'happy').length,
                            neutral: response.data.filter(f => f.overallSentiment === 'neutral').length,
                            unhappy: response.data.filter(f => f.overallSentiment === 'unhappy').length
                        };
                    })
                );
                setFeedbackData(sentimentData);
            } catch (error) {
                console.error('Failed to fetch feedback', error);
            }
        };

        if (courses.length > 0) {
            fetchFeedbackData();
        }
    }, [courses]);

    const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];


    return (
        <>
            <div className='w-full bg-black py-5 flex items-center justify-center'>
                <h1 className="text-3xl font-bold text-white">Courses Dashboard</h1>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8"
            >

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Course List */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-6"
                    >
                        <h2 className="text-2xl font-bold mb-4">Courses</h2>
                        <form onSubmit={handleAddCourse} className="mb-4">
                            <input
                                type="text"
                                value={newCourse.courseName}
                                onChange={(e) => setNewCourse({ courseName: e.target.value })}
                                placeholder="Enter Course Name"
                                className="w-full p-2 border rounded-lg"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg"
                            >
                                Add Course
                            </motion.button>
                        </form>
                        <ul>
                            {courses.map((course) => (
                                <motion.li
                                    key={course._id}
                                    whileHover={{ x: 10 }}
                                    className="p-2 border-b last:border-b-0 hover:bg-gray-100 flex justify-between items-center"
                                >
                                    {course.courseName}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleGiveFeedback(course._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                                    >
                                        Give Feedback
                                    </motion.button>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Sentiment Bar Chart */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-6 col-span-2"
                    >
                        <h2 className="text-2xl font-bold mb-4">Course Sentiment Analysis</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={feedbackData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="courseName" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="happy" stackId="a" fill="#00C49F" />
                                <Bar dataKey="neutral" stackId="a" fill="#FFBB28" />
                                <Bar dataKey="unhappy" stackId="a" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Sentiment Pie Chart */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-6"
                    >
                        <h2 className="text-2xl font-bold mb-4">Overall Sentiment Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Happy', value: feedbackData.reduce((sum, course) => sum + course.happy, 0) },
                                        { name: 'Neutral', value: feedbackData.reduce((sum, course) => sum + course.neutral, 0) },
                                        { name: 'Unhappy', value: feedbackData.reduce((sum, course) => sum + course.unhappy, 0) }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[0, 1, 2].map((index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
};

export default Dashboard;