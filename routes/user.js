import express from "express";
const router = express.Router();
import { ensureAuth, ensureGuest } from "../middleware/auth.js";

// @desc    Login/Landing Page
// @route   GET / 
router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.user);
    res.render('dashboard', {
        // We can pass an object to be accessed in the renderred page.
        name: req.user.firstName
        // We simply can access it in double curly braces {{name}} in the view.
         
    })
}); 


// @desc    Dashboard
// @route   GET /dashboard

// To specify which layout will be applied for this route.
// We can pass it as a second argument 
router.get('/', ensureGuest, (req, res) => {res.render('login', {
    layout: 'login'
})});




export default router;