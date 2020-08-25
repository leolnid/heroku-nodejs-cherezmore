require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const bodyParser = require('body-parser')


port = process.env.PORT || 3000;


const mongoose = require('mongoose');
mongoose.connect(
    `mongodb+srv://Master:${ process.env.MONGODB_ATLAS_PASSWORD }@cluster0.tnrxg.mongodb.net/${ process.env.MONGODB_ATLAS_DATABASE }?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);


// TODO: Move to CreateApp function
const app = express();
app.use(morgan('short'));
app.use(helmet());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const User = require('./models/user');


// TODO: Move to routes and controllers folders
// TODO: Split logic and routes
// TODO: Add capcha for register and login
app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) return res.status(401).json({ message: "Auth Failed" });

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err || !result) return res.status(401).json({ message: "Auth Failed" });

                jwt.sign({
                    email: user.email,
                    userId: user._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1d"
                }, (err, token) => {
                    if (err) return res.status(401).json({ message: "Auth Failed" });

                    res.json({
                        message: "Auth Successful",
                        token: token
                    })
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        }); 
})


app.post('/register', (req, res) => {
    // TODO: Check, if email exist
    // TODO: Validate email and password
    // TODO: Check for optional data
    // TODO: Add bio {fullname, age, adress, etc}

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
        })

        user
            .save()
            .then(user => {
                res.status(201).json({
                    message: "User Created",
                    userDdata: user
                })
            }).catch(err => {
                console.log(err);
                return res.status(500).json({
                    error: err
                })
            })
    })
})


app.get('/user', (req, res) => {
    User.find()
        .exec()
        .then(result => {
            res.json({
                length: result.length,
                users: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    // TODO: Return all users
})


app.get('/user/:id', (req, res) => {
    // TODO: Return user by id
})


app.put('/api/v1/user/:id', (req, res) => {
    // TODO: Change user data by id and return new data
})





app.get('/', (req, res, next) => {
    res.json({
        message: "Hello, World"
    })
})


app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    
    next(error);
})


app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            stack: process.env.NODE_ENV === "production"? "😒": err.stack, 
        }
    })
})


// TODO: Start server only if connection to database success
app.listen(port, () => console.log(`Server started on port: ${port}`))