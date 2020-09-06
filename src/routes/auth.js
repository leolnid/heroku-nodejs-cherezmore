const { Router } = require('express');
const AuthController = require('./../controllers/auth');

const AuthRouter = Router();

AuthRouter.use('/login', AuthController.login);
AuthRouter.use('/register', AuthController.register);
// AuthRouter.use('/verify/:token' /*...*/);
// AuthRouter.use('/resend' /*...*/);

module.exports = AuthRouter;
