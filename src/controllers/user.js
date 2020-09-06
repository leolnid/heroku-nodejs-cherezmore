require('dotenv').config();

// Custom variables
const Utils = require('./../utils');
const User = require('./../models/user');

exports.getAllUsers = (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      return res.json({
        length: users.length,
        users: users,
      });
    })
    .catch((UserFindError) => {
      return res.json({ error: { message: UserFindError } });
    });
};

exports.getUserByID = (req, res, next) => {
  User.findById({ _id: req.params.id })
    .exec()
    .then((user) => {
      res.json({
        user: user,
      });
    })
    .catch((UserFindError) => {
      return res.json({ error: { message: UserFindError } });
    });
};
