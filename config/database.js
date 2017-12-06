// Asynchronous
const crypto = require('crypto').randomBytes(256).toString('hex');
// use environment variable for mlab url
var dotenv = require('dotenv');
dotenv.config();
var url = process.env.MONGOLAB_URI;

module.exports = {
    uri: url + '/mean-blog',
    secret: crypto,
    db: 'mean-blog'
}