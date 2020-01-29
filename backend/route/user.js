const router = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");

let User = require("../model/user");

router.route("/").get((req, res) => {
    User.findOne({
        username: jsonwebtoken.verify(
            req.headers.authorization.split(" ")[1],
            process.env.AXIOM_IV
        ).username
    })
        .then(user => {
            delete user.password;
            res.json(user);
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
                res.json({ success: true, err: null, role: user.isServer, token });
            });
        } else {
            res.status(400).json(err);
        }
    });
});

router.route("/signup").post(async (req, res) => {
    await new User(req.body).save(function (err, doc) {
        if (err) res.status(400).json(err);
        else res.json(doc);
    });
});

module.exports = router;
