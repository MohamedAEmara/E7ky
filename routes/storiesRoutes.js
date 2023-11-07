import express from "express";
const router = express.Router();
import { ensureAuth } from "../middleware/auth.js";
import { getAddStoryPage, deleteStory, getUserStories, getPublicStories, updateStory, getEditStoryPage, getStory, addStory, getLikes } from "../controllers/storyController.js";

// @desc    Show add page
// @route   GET /stories/add 
router.get('/add', ensureAuth, getAddStoryPage); 

// @desc    Get all user liked Stories:
// @route   GET /stories/user/likes/:id
router.get('/likes', ensureAuth, getLikes);


// @desc    Process the add form
// @route   POST /stories 
router.post('/', ensureAuth, addStory); 


// @desc    Show all public stories
// @route   GET /stories
router.get('/', ensureAuth, getPublicStories)


// @desc    Show edit page
// @route   Get /stories/edit/:id
router.get('/edit/:id', ensureAuth, getEditStoryPage)


// @desc    Update story
// @route   PUT/stories/:id
router.put('/:id', ensureAuth, updateStory)


// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, deleteStory)


// @desc    Display single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, getStory)


// @desc    Display All User stories
// @route   GET /stories/user/:id
router.get('/user/:id', ensureAuth, getUserStories)


export default router;