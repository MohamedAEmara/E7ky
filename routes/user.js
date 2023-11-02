import express from "express";
const router = express.Router();
import { ensureAuth, ensureGuest } from "../middleware/auth.js";
import { Story } from "../models/Story.js";

// @desc    Login/Landing Page
// @route   GET / 
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
    
        const stories = await Story.find({ author: req.user._id }).lean();        // Get all stories which this user is thier Author.
    
        // After fetching the stories.
        // We'll pass them to the template.
        res.render('dashboard', {
            // We can pass an object to be accessed in the renderred page.
            name: req.user.firstName,
            stories
            // We simply can access it in double curly braces {{name}} in the view.
    
        })

    } catch (err) {
        console.log(err);
        res.render('/errors/500');
    }


}); 


// @desc    Dashboard
// @route   GET /dashboard

// To specify which layout will be applied for this route.
// We can pass it as a second argument 
router.get('/', ensureGuest, (req, res) => {res.render('login', {
    layout: 'login'
})});




export default router;