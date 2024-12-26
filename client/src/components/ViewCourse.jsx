import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { BookOpen, School, Library, Construction, Star, ChevronDown, Award, TrendingUp, PieChartIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

const ViewCourse = () => {
    const location = useLocation();
    const { courseId, courseName } = location.state;
    const [feedbackData, setFeedbackData] = useState({
        happy: 0,
        neutral: 0,
        unhappy: 0,
        courseExpertise: 0,
        courseContents: 0,
        labInfrastructure: 0,
        libraryFacility: 0
    });
    const [selectedSection, setSelectedSection] = useState(null);
    const [activeChart, setActiveChart] = useState('line');

    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                const response = await axios.get(`https://customer-feedback-backend-one.vercel.app/course/${courseId}/feedback`);
                const data = {
                    happy: response.data.filter(f => f.overallSentiment === 'happy').length,
                    neutral: response.data.filter(f => f.overallSentiment === 'neutral').length,
                    unhappy: response.data.filter(f => f.overallSentiment === 'unhappy').length,
                    courseExpertise: response.data.reduce((acc, curr) => acc + curr.feedback.courseExpertise.score, 0) / response.data.length,
                    courseContents: response.data.reduce((acc, curr) => acc + curr.feedback.courseContents.score, 0) / response.data.length,
                    labInfrastructure: response.data.reduce((acc, curr) => acc + curr.feedback.labInfrastructure.score, 0) / response.data.length,
                    libraryFacility: response.data.reduce((acc, curr) => acc + curr.feedback.libraryFacility.score, 0) / response.data.length
                };
                setFeedbackData(data);
            } catch (error) {
                console.error('Failed to fetch feedback', error);
            }
        };
        fetchFeedbackData();
    }, [courseId]);

    const chartData = [
        { sentiment: 'Happy', sentimentScore: feedbackData.happy },
        { sentiment: 'Neutral', sentimentScore: feedbackData.neutral },
        { sentiment: 'Unhappy', sentimentScore: feedbackData.unhappy },
    ];

    const SENTIMENT_COLORS = ['#00C49F', '#FFBB28', '#FF8042'];
    const pieData = [
        { name: 'Happy', value: feedbackData.happy },
        { name: 'Neutral', value: feedbackData.neutral },
        { name: 'Unhappy', value: feedbackData.unhappy }
    ];

    const getSentimentColor = (score) => {
        if (score >= 4.0) return 'bg-green-100 text-green-800';
        if (score >= 2.0) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getSentimentText = (score) => {
        if (score >= 4.0) return 'Happy';
        if (score >= 2.0) return 'Neutral';
        return 'Unhappy';
    };

    const FeedbackCard = ({ title, icon: Icon, score }) => (
        <motion.div
            layout
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.round(score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getSentimentColor(score)}`}>
                            {getSentimentText(score)}
                        </span>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );

    const ChartSelector = () => (
        <div className="flex gap-4 mb-4">
            {[
                { id: 'line', icon: TrendingUp, label: 'Trend' },
                { id: 'bar', icon: Award, label: 'Distribution' },
                { id: 'pie', icon: PieChartIcon, label: 'Overview' }
            ].map(({ id, icon: Icon, label }) => (
                <motion.button
                    key={id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        activeChart === id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => setActiveChart(id)}
                >
                    <Icon className="h-4 w-4" />
                    {label}
                </motion.button>
            ))}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-6">Course Feedback Analytics <span className='text-base font-normal'>for</span> {courseName}</h1>
            </motion.div>

            <div className='flex flex-col gap-6'>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold mb-5">Feedback Analysis</CardTitle>
                        <ChartSelector />
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeChart}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    {activeChart === 'line' && (
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="sentiment" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="sentimentScore" stroke="#2563eb" strokeWidth={2} />
                                        </LineChart>
                                    )}
                                    {activeChart === 'bar' && (
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="sentiment" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="sentimentScore" fill='#2A004E' />
                                        </BarChart>
                                    )}
                                    {activeChart === 'pie' && (
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    )}
                                </ResponsiveContainer>
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-5 w-full">
                    {[
                        { title: 'Course Expertise', icon: School, score: feedbackData.courseExpertise },
                        { title: 'Course Contents', icon: BookOpen, score: feedbackData.courseContents },
                        { title: 'Lab Infrastructure', icon: Construction, score: feedbackData.labInfrastructure },
                        { title: 'Library Facility', icon: Library, score: feedbackData.libraryFacility }
                    ].map((item) => (
                        <FeedbackCard
                            key={item.title}
                            {...item}
                            isExpanded={selectedSection === item.title}
                            onClick={() => setSelectedSection(selectedSection === item.title ? null : item.title)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewCourse;