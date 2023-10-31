import { Strategy } from "passport-google-oauth20";
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
import mongoose from "mongoose";
import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });

export const passportConfig = function (passport) {
    // console.log(process.env.GOOGLE_CLIENT_ID);
    // console.log('................')
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    }, 
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        console.log(newUser);
        try {
            let user = await User.findOne({ googleId: profile.id });
            if(user) {
                done(null, user);       // null for error.
            } else {
                user = await User.create(newUser);
                done(null, 'user');
            }
        } catch (err) {
            console.log(err);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
}

