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
        const auth = req.user;
        res.render('stories/index', {
            auth, stories
        });
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
})


// @desc    Show edit page
// @route   Get /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res, next) => {
    // const story = await Story.findById(req.params.id).lean();
    const story = await Story.findOne({ _id: req.params.id });
    
    // If there is no story with this id:     ==>   render 404 page
    if(!story) {
        res.render('errors/404.hbs');
    }
    
    // If the requesting user is not the owner of the story     ==>     redirect to stories
    else if((req.user._id).toString() !== (story.author).toString()) {
        res.redirect('/stories');
    } else {
        // Otherwise: render "edit story" page and pass this story..
        // console.log(story);
        const body = story.body;
        const status = story.status;
        const author = story.author;
        const title = story.title;
        let isPublic;
        if (story.status === "public") {
            console.log("🌎🌎🌎🌎🌎🌎")
            isPublic = true
        }
        res.render('stories/edit', {
            title,
            story,
            body,
            isPublic,
            author
        });  
    }

    

})

export default router;