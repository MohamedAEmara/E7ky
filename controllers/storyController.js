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
    const story = await Story.findOne({ _id: id }).populate('author');
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
        const stories = await getStoriesFromIds(likes_ids);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log(stories);
        // console.log(stories[0]);
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        const auth = user;
        res.render('stories/likes', {
            // name,
            stories,
            auth
        })
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

// export const getDashboard = async (req, res) => {
//     try {
//         const stories = await Story.find({ author: req.user._id }).lean();        // Get all stories which this user is thier Author.
    
//         // After fetching the stories.
//         // We'll pass them to the template.
//         res.render('dashboard', {
//             // We can pass an object to be accessed in the renderred page.
//             name: req.user.firstName,
//             stories
//             // We simply can access it in double curly braces {{name}} in the view.
//         })
//     } catch (err) {
//         console.log(err);
//         res.render('/errors/500');
//     }
// }; 

