import express from "express";
const router = express.Router();
import { ensureAuth } from "../middleware/auth.js";
import { Story } from "../models/Story.js";
import { User } from "../models/User.js";


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
        const id = story._id;
        let isPublic;
        if (story.status === "public") {
            isPublic = true
        }
        res.render('stories/edit', {
            title,
            story,
            body,
            isPublic,
            author,
            id
        });  
    }

})



// @desc    Update story
// @route   PUT/stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
        return res.render('/errors/404');
    } else if ((req.user._id).toString() !== (story.author).toString()) {
        res.redirect('/stories');
    } else {
        const test = req.params.id;
        story = await Story.findByIdAndUpdate( req.params.id , {
            title: req.body.title,
            body: req.body.body,
            status: req.body.status 
        }, {
            new: true,
            runValidators: true
        });
        res.redirect('/dashboard');
    }
})


// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()
        console.log(story);
        if (!story) {
            return res.render('errors/404')
        }
        
        if ((story.author).toString() !== (req.user._id).toString()) {
            res.redirect('/stories')
        } else {
        await Story.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('errors/500')
    }
})


// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).populate('author').lean();
    
        if (!story) {
            return res.render('errors/404');
        } else if (story.status === 'private' && (story.author).toString() !== (req.user._id).toString()) {
            res.redirect('/dashboard');
        } else {
            const user = await User.findOne({ _id: story.author });
            res.render('stories/display', {
                story, user
            });
        } 
    } catch (err) {
        console.log(err);
        return res.render('errors/500');
    }
})

export default router;