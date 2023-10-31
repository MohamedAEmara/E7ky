import express from "express";
import passport from "passport";
const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', {
    scope: ["profile", "email"]
})); 


// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {

    failureRedirect: "/"        // redirect to login
}), (req, res) => {     // if it's successful, directo to dashboard
    console.log("Redirect to dashboard");
    res.redirect('/dashboard');
});


// @desc    Logout User
// @route   /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

export default router;