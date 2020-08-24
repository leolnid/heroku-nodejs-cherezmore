require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');


port = process.env.PORT || 3000;


const mongoose = require('mongoose');
mongoose.connect(
    `mongodb+srv://Master:${ process.env.MONGODB_ATLAS_PASSWORD }@cluster0.tnrxg.mongodb.net/${ process.env.MONGODB_ATLAS_DATABASE }?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);



const app = express();
app.use(morgan('combined'))
app.use(helmet())



app.post('/api/v1/auth/login', (req, res) => {
    // TODO: Add login method
})


app.post('/api/v1/auth/logout', (req, res) => {
    // TODO: Add logout method
})


app.post('/api/v1/auth/register', (req, res) => {
    // TODO: Add register method
})


app.get('/api/v1/user/', (req, res) => {
    // TODO: Return all users
})


app.get('/api/v1/user/:id', (req, res) => {
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
        }
    })
})


app.listen(port, () => console.log(`Server started on port: ${port}`))