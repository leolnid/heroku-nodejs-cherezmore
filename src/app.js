const express = require('express');
const morgan = require('morgan');


port = process.env.PORT || 3000;


const app = express();
app.use(morgan('dev'))


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