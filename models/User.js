import mongoose from "mongoose";



const UserSchema = new mongoose.Schema({
    // NOTE: googleId is not the _id that mongo gives by default.
    googleId: {
        type: String,
        required: true
    },
    displayName: {      // first & last name that google gives us 
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ceatedAt: {
        type: Date,
        default: Date.now()
    }
});



export const userModel = mongoose.model("User", UserSchema);