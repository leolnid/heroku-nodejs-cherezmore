const { Router } = require('express');
const UserController = require('./../controllers/user');
const { Auth, Roles } = require('./../utils');

const UserRouter = Router();

UserRouter.get(
  '/:id',
  Auth.checkToken,
  // Auth.hasPermission(Roles.Admin),
  UserController.getUserByID
);

UserRouter.get(
  '/',
  Auth.checkToken,
  // Auth.hasPermission(Roles.Admin),
  UserController.getAllUsers
);

module.exports = UserRouter;
