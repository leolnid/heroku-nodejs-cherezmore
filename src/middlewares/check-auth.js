const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) 
            return res.status(401).json({ message: "Auth Failed" })
           
        req.userData = decoded;
        next();
    });
}