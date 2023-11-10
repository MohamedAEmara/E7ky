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
        
        // const test = await Story.aggregate([
        //     {
        //         $match: { status: 'public' },
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'author',
        //             foreignField: '_id',
        //             as: 'authorData',
        //         },
        //     },
        //     {
        //         $unwind: '$authorData',
        //     },
        //     {
        //         $addFields: {
        //             likesCount: {$size: '$authorData.likes'},
        //         },
        //     },
        //     {
        //         $sort: {
        //             likesCount: -1,
        //             createdAt: -1,
        //         },
        //     },
        // ]);
        
        // const stories = await User.populate(test, { path: 'author' });
        
        
        // console.log(test);
        // console.log('=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=--=-=');
        // console.log(stories);
        
        console.log(stories);
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
            const loggedUser = req.user;
            res.render('stories/display', {
                story, user, loggedUser
            });
        } 
    } catch (err) {
        console.log(err);
        return res.render('errors/500');
    }
}



export const getUserStories = async (req, res) => {
    try {
        let stories;

        // If the logged in user directs his own page, he'll see all public & private stories.
        if((req.params.id).toString() === (req.user._id).toString()) {
            stories = await Story.find({ author: req.params.id }).populate('author').lean();
        } else {
            stories = await Story.find({ author: req.params.id, status: 'public' }).populate('author').lean();
        }

        // const auth = stories[0].author;
        const auth = req.user;
        const displayName = stories[0].author.displayName;
        res.render('stories/user', {
            auth, stories, displayName
        });
    } catch (err) {
        console.log(err);
        res.render('errors/500');
    }
}


// const getStoriesFromIds = async (likes_ids) => {
//   try {
//     const storyPromises = likes_ids.map(async (id) => {
//       return await Story.findOne({ _id: id });
//     });

//     const stories = await Promise.all(storyPromises);
//     return stories;
//   } catch (error) {
//     // Handle errors if necessary
//     console.error(error);
//     throw error;
//   }
// };


const getStoryFromId = async (id) => {
    const story = await Story.findOne({ _id: id }).populate('author').lean();
    console.log("HERE IS THE STORYYYYYYYYYYYYYYYYY");
    console.log("===================================");
    console.log(story);
    return story;
}


const getStoriesFromIds = async (likes_ids) => {
    let stories = [];
    for (const id of likes_ids) {
        const story = await getStoryFromId(id);
        stories.push(story);
    }
    console.log("Stories:");
    console.log(stories);
    return stories;
} 


export const getLikes = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findOne({ _id: id });
        
        // const stories = await Story.find({ status: 'public' }).populate('author').sort({ createdAt: 'desc' }).lean();
        
        const likes_ids = user.likes;
        
        const name = user.firstName;
        // const stories = await getStoriesFromIds(likes_ids);
        // const stories = await Story.find();
        let stories = [];
        for (const id of likes_ids) {
            const story = await Story.findById( id ).populate('author');
            stories.push(story);
        }

        const test = await Story.find();
        
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(stories);
        // console.log(stories[0]);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(test);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        const auth = user;
        res.render('stories/likes', {
            // name,
            auth,
            stories
        });
        // res.status(200).json({

        //     status: 'success',
        //     message: likes          
        //     // I'll edit it after finishing the view.
        // });
        // storyUser, loggedUser, storyId,
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}



export const likeStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.user._id;
        let user = await User.findOne({ _id: userId });

        // console.log("=-=-=-=-=-=--=-=-=-=--=-=-=-=-=-=-=-=")
        // console.log(user);
        // console.log("=-=-=-=-=-=--=-=-=-=--=-=-=-=-=-=-=-=")
        let likes = user.likes;
        console.log(likes);
        if(likes.includes(storyId.toString())) {
            await User.findByIdAndUpdate(userId, {
                $pull: { likes: storyId }
            });
            console.log("NO CHANGE");

        } else {

            await User.findByIdAndUpdate(userId, {
                $push: { likes: storyId }
            })
            .then(console.log('Story liked Successfully :)'));
        }

        user = await User.findOne({ _id: userId });

        likes = user.likes;
        
        let stories = [];
        for (const id of likes) {
            const story = await Story.findById( id );
            stories.push(story);
        }

        const auth = user;
        // const auth = User.findOne({ _id: userId });
        // const stories = auth.likes;
        res.render('stories/likes', {
            auth, stories
        });
        
    } catch (err) {
        console.log(err);
        res.render('/errors/500');
    }
}



const welcomeNewUser = (req, res) => {
    res.render('/welcome_new');
}