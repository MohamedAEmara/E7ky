import express from "express";
const router = express.Router();
import { ensureAuth, ensureGuest } from "../middleware/auth.js";

// @desc    Login/Landing Page
// @route   GET / 
router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.user);
    res.render('dashboard')
}); 


// @desc    Dashboard
// @route   GET /dashboard

// To specify which layout will be applied for this route.
// We can pass it as a second argument 
router.get('/', ensureGuest, (req, res) => {res.render('login', {
    layout: 'login'
})});




export default router;