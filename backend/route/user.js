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
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').get((req, res) => {
    const uid = req.body.username;
    const pswd = req.body.password;
    User.findOne({username: uid}, (err, user) => {
        if (err) {
            res.status(400).json("Error!");
        } else {
            user.comparePassword(pswd, (err, isMatch) => {
                if (err) res.status(400).json("Error!");
                if (!isMatch) res.status(401).json("Password Not Correct");
                let token = jsonwebtoken.sign({username: uid}, 
                                              'yyx is always being correct', 
                                              {algorithm: 'HS256',
                                               expiresIn: 129600});
                res.json({
                    success: true, 
                    err: null, 
                    token
                });
            });
        }
    });
});

router.route('/signup').post((req, res) => {

    const uid = new String(req.body.username);
    const pswd = new String(req.body.password);
    const newUser = new User({username: uid, password: pswd});

    newUser.save(function(err, doc) {
        if (err) res.status(400).json("Error");
        res.status(500).json(doc);
    });
    
});

module.exports = router;