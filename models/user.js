var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// check email lenght
let emailLength = (email) => {
    if(!email) {
        return false;
    } else {
        if(email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
}

// check valid email address
let validEmail = (email) => {
    if (!email) {
        return false;
    } else {
        var regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}

var emailValidators = [
    {
        validator: emailLength, 
        message: 'E-mail must be at least 5 characters but no more than 30'
    },
    {
        validator: validEmail,
        message: 'Invalid e-mail'
    }
]

// check username length
var usernameLength = (username) => {
    if(!username) {
        return false;
    } else {
        if(username.length < 5 || username.length > 20) {
            return false;
        } else {
            return true;
        }
    }
}

// validate username, no special chars
var validUsername = (username) => {
    if(!username) {
        return false;
    } else {
        var regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}

var usernameValidators = [
    {
        validator: usernameLength,
        message: 'Username must be at least 5 characters but no more than 20'
    },
    {
        validator: validUsername,
        message: 'Username must not have any special characters'
    }
]

// check password length
var passwordLength = (password) => {
    if (!password) {
        return false; 
    } else {
        if (password.length < 8 || password.length > 25) {
            return false;
        } else {
            return true;
        }
    }
}

// validate password
var validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        var regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
}

var passwordValidators = [
    {
        validator: passwordLength,
        message: 'Password must be at least 8 characters but no more than 25'
    },
    {
        validator: validPassword,
        message: 'Password must have at least one uppercase, lowercase, special character, and number'
    }
]

var userSchema = new Schema({
  email:  {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
  username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
  password:   {type: String, required: true, validate: passwordValidators}
});

// encrypt password
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    } else {
        bcrypt.hash(this.password, null, null, (err, hash) => {
            if (err) {
                return next(err);
            } else {
                this.password = hash;
                next();
            }
            
        })
    }
})

// compare password when user logs in
userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);