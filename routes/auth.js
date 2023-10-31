import express from "express";
import passport from "passport";
const router = express.Router();


// @desc    Auth with Google
// @route   GET /auth/google
router.get('/auth/google', passport.authenticate('google', {
    scope: ["profile"]
})); 


// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: "/"        // redirect to login
}), (req, res) => {     // if it's successful, directo to dashboard
    res.redirect('/dashboard');
});




export default router;