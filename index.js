var express = require('express');
var app = express();
var config = require('./config/database');
var path = require('path');
// var dotenv = require('dotenv');
// dotenv.config();

// var url = process.env.MONGOLAB_URI;

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) {
        console.log('Could not connect to database: ', err);
    } else {
        // console.log(config.secret);
        console.log('Connected to database: ' + config.db);
    }
});

// make angular prod build available
app.use(express.static(__dirname + '/client/dist/'));

// redirect to angular index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});