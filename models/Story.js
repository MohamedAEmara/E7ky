import mongoose from "mongoose";



const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {      // first & last name that google gives us 
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    author: {
        // Here we'll attach a User from the UserSchema to this story.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ceatedAt: {
        type: Date,
        default: Date.now()
    }
});



export const Story = mongoose.model("Story", StorySchema);