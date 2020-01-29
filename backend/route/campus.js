const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let User = require("../model/user");
let Campus = require("../model/campus");
require("dotenv").config();

router.route("/").get((req, res) => {
    User.findOne(
        {
            username: jwt.verify(
                req.headers.authorization.split(" ")[1],
                process.env.AXIOM_IV
            ).username
        },
        (err, doc) => {
            if (!err) {
                let query = {};
                if (!doc.isServer) query = { username: doc.username };
                User.find({ family: doc.family }).then(users => {
                    let ors = [];
                    for (const usr of users) {
                        ors.push({ username: usr.username });
                    }
                    console.log()
                    Campus.find({ $and: [query, { $or: ors }] }, (err, campuses) => {
                        if (err) res.status(400).json(err);
                        else res.json(campuses);
                    });
                })
                
            } else {
                res.status(400).json(err);
            }
        }
    );
});

router.route("/issue").post((req, res) => {
    let newCampus = new Campus(req.body);
    newCampus.username = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.AXIOM_IV
    ).username;
    newCampus.status = "issued";
    if (!newCampus.dateDue) newCampus.dateDue = new Date();
    newCampus.save((err, doc) => {
        if (err) res.status(400).json(err);
        else res.json(doc);
    });
});

router.route("/issue").delete((req, res) => {
    User.findOne(
        {
            username: jwt.verify(
                req.headers.authorization.split(" ")[1],
                process.env.AXIOM_IV
            ).username
        },
        (err, doc) => {
            if (!err && !doc.isServer) {
                Campus.findOneAndRemove({
                    _id: new mongoose.Types.ObjectId(req.body._id),
                    username: doc.username
                })
                    .then(doc => {
                        res.json(doc);
                    })
                    .catch(err => {
                        res.status(400).json(err);
                    });
            } else if (doc.isServer) {
                res.json(null);
            } else {
                res.status(400).json(err);
            }
        }
    );
});

router.route("/issue").put((req, res) => {
    User.findOne(
        {
            username: jwt.verify(
                req.headers.authorization.split(" ")[1],
                process.env.AXIOM_IV
            ).username
        },
        (err, doc) => {
            if (!err) {
                if (!doc.isServer) delete req.body.newData.status;
                else req.body.newData = { status: req.body.newData.status };
                let query = {};
                if (!doc.isServer) {
                    query = {
                        _id: new mongoose.Types.ObjectId(req.body.id),
                        username: doc.username
                    };
                } else {
                    query = { _id: new mongoose.Types.ObjectId(req.body.id) };
                }
                Campus.findOneAndUpdate(
                    query,
                    { $set: req.body.newData },
                    { useFindAndModify: false }
                )
                    .then(doc => {
                        Campus.findOne({ _id: doc._id })
                            .then(doc => {
                                res.json(doc);
                            })
                            .catch(err => {
                                res.status(400).json(err);
                            });
                    })
                    .catch(err => {
                        res.status(400).json(err);
                    });
            } else {
                res.status(400).json(err);
            }
        }
    );
});

module.exports = router;
