import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    BookOpen, Plus, TrendingUp, Users, Activity,
    ThumbsUp, ThumbsDown, Meh, ChevronRight, Star,
    Calendar, Clock, Award
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const navigate = useNavigate();
    const [newCourse, setNewCourse] = useState({ courseName: '' });
    const itemsPerPage = 4;

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

    const weeklyData = [
        { week: 'Week 1', students: 120, completion: 85 },
        { week: 'Week 2', students: 150, completion: 78 },
        { week: 'Week 3', students: 180, completion: 92 },
        { week: 'Week 4', students: 220, completion: 88 }
    ];

    const paginatedCourses = courses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/courses', newCourse);
            setCourses([...courses, response.data]);
            setNewCourse({ courseName: '' });
            setSelectedCourse(null);
        } catch (error) {
            console.error('Failed to add course', error);
        }
    };

    const handleGiveFeedback = (courseId, courseName) => {
        navigate(`/feedback`, {
            state: {
                courseId: courseId,
                courseName: courseName
            }
        });
    };

    const handleViewCourse = (courseId, courseName) => {
        const slug = courseName.toLowerCase().replace(/\s+/g, '-');
    
        navigate(`/${slug}`, { state: { courseId, courseName } });
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Course Analytics Dashboard</h1>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                            <Users className="w-5 h-5" />
                            <span>1,980 Active Users</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                            <Award className="w-5 h-5" />
                            <span>92% Satisfaction Rate</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Total Courses', value: courses.length, icon: BookOpen, color: 'bg-blue-500' },
                        { title: 'Total Students', value: '2.5k+', icon: Users, color: 'bg-green-500' },
                        { title: 'Avg. Rating', value: '4.6', icon: Star, color: 'bg-yellow-500' },
                        { title: 'Completion Rate', value: '88%', icon: Award, color: 'bg-purple-500' }
                    ].map((stat, i) => (
                        <Card key={i} className="relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="students" stroke="#8b5cf6" />
                                    <Line type="monotone" dataKey="completion" stroke="#06b6d4" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Course Feedback Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={courses.map(course => ({
                                            name: course.courseName,
                                            value: course.feedback.length
                                        }))}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                    >
                                        {courses.map((_, index) => (
                                            <Cell key={index} fill={['#8b5cf6', '#06b6d4', '#14b8a6', '#f59e0b', '#ef4444'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} feedbacks`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Courses & Feedback */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Course Feedback</h3>
                            <Button variant="outline" onClick={() => setSelectedCourse(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Add Course
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {paginatedCourses.map((course) => (
                                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-violet-100 p-3 rounded-lg">
                                            <BookOpen className="w-6 h-6 text-violet-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{course.courseName}</h4>
                                            <p className="text-sm text-gray-600">{course.feedback.length} feedbacks</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center">
                                            <Star className="w-5 h-5 text-yellow-500" />
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleViewCourse(course._id, course.courseName)}
                                        >
                                            View Course
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleGiveFeedback(course._id, course.courseName)}
                                        >
                                            Give Feedback
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: Math.ceil(courses.length / itemsPerPage) }).map((_, i) => (
                                <Button
                                    key={i}
                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className="w-10 h-10"
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {selectedCourse && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <Card className="w-full max-w-md">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Add Course</h3>
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Enter Course Name"
                                        value={newCourse.courseName}
                                        onChange={(e) => setNewCourse({ courseName: e.target.value })}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddCourse}>
                                            Add Course
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
        </div>
    );
};

export default Dashboard;