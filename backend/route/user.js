const router = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");

let User = require("../model/user");
let Family = require("../model/family");

router.route("/").get((req, res) => {
    User.findOne({
        username: jsonwebtoken.verify(
            req.headers.authorization.split(" ")[1],
            process.env.AXIOM_IV
        ).username
    })
        .then(user => {
            Family.findOne({ family: user.family }).then(f => res.json(f));
        })
        .catch(err => res.status(400).json(err));
});

router.route("/login").get((req, res) => {
    if (!req.headers.username || !req.headers.password) {
        res.status(400).json("bad request");
        return;
    }
    User.findOne({ username: req.headers.username }, (err, user) => {
        if (!err && user) {
            user.comparePassword(req.headers.password, (err, isMatch) => {
                if (err) return res.status(400).json(err);
                if (!isMatch) return res.status(401).json("Password Not Correct");
                let token = jsonwebtoken.sign(
                    { username: req.headers.username },
                    process.env.AXIOM_IV,
                    { algorithm: "HS256", expiresIn: 129600 }
                );
                res.json({ success: true, err: null, name: user.username, token });
            });
        } else {
            res.status(400).json(err);
        }
    });
});

router.route("/signup").post((req, res) => {
    if (req.body.family && req.body.username) {
        req.body.username = req.body.username + '@' + req.body.family;
        Family.findOne({ family: req.body.family }).then(async (doc) => {
            console.log(doc)
            if (!doc) {
                await new Family({ family: req.body.family, member: [req.body.username] }).save();
            } else {
                if (!doc.member.includes(req.body.username)) doc.member.push(req.body.username);
                await doc.save().catch(err => {
                    res.status(400).json(err);
                    return;
                });
            }
            await new User(req.body).save((err, doc) => {
                if (err) res.status(400).json(err);
                else res.json(doc);
            });
        }).catch(err => {
            res.status(400).json(err);
            return;
        });
    } else {
        res.status(400).json("should be a family");
        return;
    }
});

module.exports = router;
