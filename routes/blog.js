var User = require('../models/user');
var Blog = require('../models/blog');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

module.exports = (router) => {
    router.post('/newBlogs', (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'Title is required' });
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: 'Body is required' });
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Author is required' });
                } else {
                    var blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    blog.save((err) => {
                        if (err) {
                            if (err.errors) {
                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message });
                                } else {
                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message });
                                    } else {
                                        res.json({ success: false, message: err.errmsg });
                                    }
                                }
                            } else {
                                res.json({ success: false, message: err });                                
                            }
                        } else {
                            res.json({ success: true, message: 'Blog saved!' });
                        }
                    })
                }
                
            }
        }
    });

    return router;
};