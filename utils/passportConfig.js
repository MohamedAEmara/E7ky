import GoogleStrategy from "passport-google-oauth20";
import mongoose from "mongoose";
import {userModel} from "../models/User.js";


export default function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGOLE_CLIENT_SECRET,
        callbackURL: "auth/google/callback"
    }, 
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}