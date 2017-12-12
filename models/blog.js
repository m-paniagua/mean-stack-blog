var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

// check title length
let titleLength = (title) => {
    if(!title) {
        return false;
    } else {
        if(title.length < 5 || title.length > 50) {
            return false;
        } else {
            return true;
        }
    }
}

// check valid title
let validTitle = (title) => {
    if (!title) {
        return false;
    } else {
        var regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
}

var titleValidators = [
    {
        validator: titleLength, 
        message: 'Title must be at least 5 characters but no more than 50'
    },
    {
        validator: validTitle,
        message: 'Title may only contain alphanumeric characters'
    }
]

// check body length
var bodyLength = (body) => {
    if(!body) {
        return false;
    } else {
        if(body.length < 5 || body.length > 500) {
            return false;
        } else {
            return true;
        }
    }
}

var bodyValidators = [
    {
        validator: bodyLength,
        message: 'Body must be at least 5 characters but no more than 500'
    }
]

// check comment length
var commentLength = (comment) => {
    if (!comment[0]) {
        return false; 
    } else {
        if (comment.length[0] < 1 || comment[0].length > 200) {
            return false;
        } else {
            return true;
        }
    }
}

var commentValidators = [
    {
        validator: commentLength,
        message: 'Comments may not exceed 200 characters'
    }
]

var blogSchema = new Schema({
  title:  {type: String, required: true, validate: titleValidators},
  body: {type: String, required: true, title: bodyValidators},
  createdBy: {type: String},
  createdAt: {type: Date, default: Date.now()},
  likes: {type: Number, default: 0},
  likedBy: {type: Array},
  dislikes: {type: Number, default: 0},
  dislikedBy: {type: Array},
  comments: [
        {
            comment: {type: String, validate: commentValidators},
            author: {type: String},
        }
  ]
});

module.exports = mongoose.model('Blog', blogSchema);