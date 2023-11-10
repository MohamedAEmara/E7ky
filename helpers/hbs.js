import moment from 'moment';
import { User } from '../models/User.js';

export const formatDate = (date, format) => {
  return moment(date).utc().format(format);
};

// Set a limit to the length of the story. Replace the rest of the story with "..."
export const truncate = (story, len) => {
  // if (str.length > len && str.length > 0) {
  //   let new_str = str + ' '
  //   new_str = str.substr(0, len)
  //   new_str = str.substr(0, new_str.lastIndexOf(' '))
  //   new_str = new_str.length > 0 ? new_str : str.substr(0, len)
  //   return new_str + '...'
  // }
  // return str
  // console.log("''''''''''''''''''''''''''''''''''''")
  // console.log(story);
  // console.log("''''''''''''''''''''''''''''''''''''")
  const input = story.body;
  console.log(input)
  
  if (input.length <= len) {
    return input;
  } else {
    return input.slice(0, len) + '...';
  }
}

// Remove any html tage.
export const stripTags = (input) => {
  // const input = story.body;
  return input.replace(/<(?:.|\n)*?>/gm, '');
}


export const editIcon = (storyUserrrr, loggedUser, storyIdddd, floating = true) => {
  // to play around the .hbs 
  // I cannot access fields in the object passed to the view ".hbs"
  // console.log(storyUserrrr);
  // console.log('xxxxxxxxxxxxxxxxxxxxx')
  let storyUser = storyUserrrr.author;
  let storyId = storyIdddd._id;
  // console.log("........................................")
  // console.log(storyUser);
  // console.log("........................................")
  // console.log(loggedUser);
  // console.log("........................................")
  // console.log(storyId);
  // console.log("........................................")
  // console.log(storyUser);
  if (storyUser._id.toString() === loggedUser._id.toString()) {
    if (floating) {
      return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
    } else {
      return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
    }
  } else {
    return ''
  }
}


export const getUserImageFromStory = (story) => {
  const image = story.author.image;
  // const user = await User.findOne({ _id: story.author });
  // const image = user.image;
  return image;
}

export const  getAuthNameFromStory = (story) => {
  console.log (story)
  // const user = await User.findOne({ _id: story.author });
  const name = story.author.displayName;
  return name;
}


export const getStoryTitle = (story) => {
  const title = story.title;
  return title;
}


export const getStoryId = (story) => {
  // console.log(story);
  const id = story._id;
  return id;
}


export const getHeartColor = (user, story) => {

  // const user = await User.findOne({ _id: userId });
  const likes = user.likes;
  // console.log(likes);
  // console.log('.x.x.x.x.x.x.x.x.x.x.x.x');
  // console.log(user);
  if(likes && likes.includes(story._id)) {      // To ensure that likes array is not empty.
    return "red";
  } else {
    return "grey";
  }
}


export const getUserId = (story) => {
  return story.author._id;
}


export const truncateTitle = (story, len) => {
  const input = story.title;
  console.log(input)
  
  if (input.length <= len) {
    return input;
  } else {
    return input.slice(0, len) + '...';
  }
}