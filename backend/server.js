const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
//const deliveryRouter = require('./route/delivery');
const userRouter = require('./route/user');
// campusRouter = require('./route/campus');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const jwt = expressJWT({secret: 'yyx is always being correct'}).unless({path: ['/user/login', '/user/add']})

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true, 
    useCreateIndex: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

//app.use('/delivery', jwt, deliveryRouter);
//app.use('/campus', jwt, campusRouter);
app.use('/user', jwt, userRouter);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});