import express from "express";
const router = express.Router();
import { ensureAuth } from "../middleware/auth.js";
import { Story } from "../models/Story.js";

// @desc    Show add page
// @route   GET /stories/add 
router.get('/add', ensureAuth, async (req, res) => {
    res.render('stories/add');
}); 


// @desc    Process the add form
// @route   POST /stories 
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.author = req.user._id;
        await Story.create(req.body);
        console.log(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
}); 


// @desc    Show all public stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' }).populate('author').sort({ createdAt: 'desc' }).lean();
        const test = await Story.find({ status: 'public' });
        console.log(stories);
        console.log(test);
        const auth = req.user;
        console.log("====================================");
        console.log(req);
        console.log("====================================");
        console.log(auth);
        console.log("====================================");
        res.render('stories/index', {
            auth, stories
        });
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
})



export default router;