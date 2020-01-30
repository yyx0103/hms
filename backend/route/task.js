const router = require("express").Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let User = require("../model/user");
let Task = require("../model/task");
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
                Task.find({ family: doc.family }).then(cs => res.json(cs)).catch(err => res.status(400).json(err));
            } else {
                res.status(400).json(err);
            }
        }
    );
});

router.route("/issue").post((req, res) => {
    let newTask = new Task(req.body);
    newTask.username = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.AXIOM_IV
    ).username;
    User.findOne({ username: newTask.username }).then((usr) => {
        newTask.family = usr.family;
        if (!newTask.dateDue) newTask.dateDue = new Date();
        newTask.save((err, doc) => {
            if (err) res.status(400).json(err);
            else res.json(doc);
        });
    })
});

router.route("/issue").delete((req, res) => {
    User.findOne({
        username: jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.AXIOM_IV
        ).username
    }).then((doc) => {
        Task.findOneAndRemove({
            _id: new mongoose.Types.ObjectId(req.body.id),
            username: doc.username,
            family: doc.family
        }).catch(err => {
            res.status(400).json(err);
        });
        res.status(200).json({});
    }).catch(err => {
        res.status(400).json(err);
    });
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
            if (err || !req.body.id) {
                res.status(400).json(err);
                return;
            }
            Task.findOne({ _id: req.body.id, family: doc.family }).then((task) => {

                delete req.body.newData.username;
                delete req.body.newData.family;
                if (!task.isFinished) {
                    if (!task.executor) {
                        // State: Issued, but not assigned -> Assigned
                        // if Tasks not assigned, could not be toggled to Finished
                        delete req.body.newData.isFinished;
                        if (doc.username.localeCompare(task.username) === 0) {
                            // Creator is allowed to change anything except for 
                            task.executor = req.body.newData.executor;
                            task.save();
                        } else {
                            // Non-creator is only allowed to make assignment to a Family Member
                            if (req.body.newData.executor) {
                                delete req.body.newData.title;
                                delete req.body.newData.description;
                                delete req.body.newData.dateDue;
                                task.executor = req.body.newData.executor;
                                task.save();
                            }
                        }
                    } else {
                        // State: Assigned but not finished -> Finished
                        // Task could only be toggled to Finished at the state "assigned"
                        if (req.body.newData.isFinished && doc.username.localeCompare(task.executor) === 0) {
                            task.isFinished = true;
                            task.save();
                        }
                    }
                }
                // State: Finished (Archived)
                res.json(task);
            });
        }
    );
});

module.exports = router;
