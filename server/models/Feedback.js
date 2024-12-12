import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    feedback: {
        courseExpertise: {
            text: String,
            sentiment: {
                type: String,
                enum: ['happy', 'neutral', 'unhappy']
            },
            score: Number
        },
        courseContents: {
            text: String,
            sentiment: {
                type: String,
                enum: ['happy', 'neutral', 'unhappy']
            },
            score: Number
        },
        labInfrastructure: {
            text: String,
            sentiment: {
                type: String,
                enum: ['happy', 'neutral', 'unhappy']
            },
            score: Number
        },
        libraryFacility: {
            text: String,
            sentiment: {
                type: String,
                enum: ['happy', 'neutral', 'unhappy']
            },
            score: Number
        }
    },
    overallSentiment: {
        type: String,
        enum: ['happy', 'neutral', 'unhappy']
    }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);