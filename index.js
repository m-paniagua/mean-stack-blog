var express = require('express');
var app = express();                                            // initialize express app
var router  = express.Router();
var mongoose = require('mongoose');
var config = require('./config/database');
var path = require('path');
var authentication = require('./routes/authentication')(router);
var blogs = require('./routes/blog')(router);
var bodyParser = require('body-parser');
var cors = require('cors');

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) {
        console.log('Could not connect to database: ', err);
    } else {
        // console.log(config.secret);
        console.log('Connected to database: ' + config.db);
    }
});

// allow cross orign request between dev and prod servers
app.use(cors({
    origin: 'http://localhost:4200',
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// make angular prod build available
app.use(express.static(__dirname + '/client/dist/'));

app.use('/authentication', authentication);
app.use('/blogs', blogs);

// redirect to angular index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// start server
app.listen(8080, () => {
    console.log('Listening on port 8080');
});