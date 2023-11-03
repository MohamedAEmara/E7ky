import { Story } from '../models/Story.js';
import { User } from '../models/User.js';



export const getAddStoryPage = async (req, res) => {
    res.render('stories/add');
};

// Controller function for the '/stories' POST route
export const addStory = async (req, res) => {
    try {
        req.body.author = req.user._id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
}



export const getPublicStories = async (req, res) => {
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
};


export const getEditStoryPage = async (req, res, next) => {
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
}



export const updateStory = async (req, res) => {
    try {
        let story = await Story.findById(req.params.id);

        if (!story) {
            return res.render('errors/404');
        }

        if (req.user._id.toString() !== story.author.toString()) {
            return res.redirect('/stories');
        }

        story = await Story.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                body: req.body.body,
                status: req.body.status,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        return res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('errors/500');
    }
};



export const deleteStory = async (req, res) => {
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
}



export const getStory = async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).populate('author').lean();
        if (!story) {
            return res.render('errors/404');
        } else if (story.status === 'private' && (story.author._id).toString() !== (req.user._id).toString()) {
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
}



export const getUserStories = async (req, res) => {
    try {
        const stories = await Story.find({ author: req.params.id, status: 'public' }).populate('author').lean();
        const auth = req.user;
        const displayName = auth.displayName;
        res.render('stories/user', {
            auth, stories, displayName
        });
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
}