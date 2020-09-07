const { Router } = require('express');
const { body } = require('express-validator');

const AuthController = require('./../controllers/auth');

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/register', AuthController.register);
AuthRouter.post('/verify', AuthController.sendToken);
AuthRouter.get('/verify/:token', AuthController.verifiToken);

module.exports = AuthRouter;
