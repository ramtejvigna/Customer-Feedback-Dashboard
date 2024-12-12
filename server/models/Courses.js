import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String, 
        required: true
    },
    feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
});

export const Course = mongoose.model('Course', courseSchema);