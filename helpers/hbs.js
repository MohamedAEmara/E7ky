import moment from 'moment';

export const formatDate = (date, format) => {
  return moment(date).utc().format(format);
};

// Set a limit to the length of the story. Replace the rest of the story with "..."
export const truncate = (input, len) => {
  // if (str.length > len && str.length > 0) {
  //   let new_str = str + ' '
  //   new_str = str.substr(0, len)
  //   new_str = str.substr(0, new_str.lastIndexOf(' '))
  //   new_str = new_str.length > 0 ? new_str : str.substr(0, len)
  //   return new_str + '...'
  // }
  // return str
  if (input.length <= len) {
    return input;
  } else {
    return input.slice(0, len) + '...';
  }
}

// Remove any html tage.
export const stripTags = (input) => {
  return input.replace(/<(?:.|\n)*?>/gm, '');
}


export const editIcon = (storyUser, loggedUser, storyId, floating = true) => {
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