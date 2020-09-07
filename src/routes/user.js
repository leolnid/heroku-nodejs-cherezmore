const { Router } = require('express');
const UserController = require('./../controllers/user');
const { auth, roles } = require('./../utils');

const UserRouter = Router();

UserRouter.get(
  '/:id',
  auth.checkToken,
  auth.hasPermission(roles.Admin),
  UserController.getUserByID
);

UserRouter.get(
  '/',
  auth.checkToken,
  auth.hasPermission(roles.Admin),
  UserController.getAllUsers
);

module.exports = UserRouter;
