const router = require('express').Router();
const jsonwebtoken = require('jsonwebtoken');

let User = require('../model/user');

router.route('/').get((req, res) => {
    User.find()
        .then(users => {
            users.map((user) => {
                user.password = null;
            });
            res.json(users);
        })
        .catch(err => res.status(400).json(err));
});

router.route('/login').get((req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if (!err) {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) res.status(400).json(err);
                if (!isMatch) res.status(401).json("Password Not Correct");
                let token = jsonwebtoken.sign({username: req.body.username}, process.env.AXIOM_IV, {algorithm: 'HS256', expiresIn: 129600});
                res.json({success: true, err: null, token});
            });
        } else {
            res.status(400).json(err);
        }
    });
});

router.route('/signup').post((req, res) => {

    new User(req.body).save(function(err, doc) {
        if (err) res.status(400).json(err);
        else res.status(500).json(doc);
    });
    
});

module.exports = router;