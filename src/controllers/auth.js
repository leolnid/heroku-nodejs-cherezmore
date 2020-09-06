require('dotenv').config();

// node_modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Custom variables
const Utils = require('./../utils');
const User = require('./../models/user');

// Login endpoint
// Get user email and user password
// TODO: Add capcha
// Return JWT to user
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (!user)
        return res.json({ error: { message: 'Incorrect email or password' } });

      bcrypt.compare(
        req.body.password,
        user.password,
        (PasswordCompareError, result) => {
          if (PasswordCompareError || !result)
            return res.json({
              error: {
                message: 'Incorrect email or password',
                error: PasswordCompareError,
              },
            });

          console.log(user);
          jwt.sign(
            {
              email: user.email,
              permission: user.permission,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '1d',
            },
            (PasswordJWTError, token) => {
              if (PasswordJWTError)
                return res.json({
                  error: {
                    message: 'Incorrect email or password',
                    error: PasswordJWTError,
                  },
                });

              res.json({
                message: 'Auth Successful',
                token: token,
              });
            }
          );
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

// Register endpoint
// Get user email and user password
// TODO: Add capcha
// Return user object
exports.register = (req, res, next) => {
  // TODO: Check for optional data
  // TODO: Add bio {fullname, age, adress, etc}

  if (!Utils.Validator.isValidEmail(req.body.email)) {
    return res.json({
      error: {
        message: 'Invalid email.',
      },
    });
  }

  if (!Utils.Validator.isValidPassword(req.body.password)) {
    return res.json({
      error: {
        message: 'Invalid password.',
      },
    });
  }

  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) return res.json({ error: { message: 'Email already taken.' } });

      bcrypt.hash(req.body.password, 10, (HashError, hash) => {
        if (HashError) return res.status(500).json({ error: HashError });

        const NewUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });

        NewUser.save()
          .then((CreatedUser) => {
            res.status(201).json({
              message: 'User Created',
              userData: CreatedUser,
            });
          })
          .catch((CreateNewUserError) => {
            return res.status(500).json({ error: CreateNewUserError });
          });
      });
    })
    .catch((FindUserError) => {
      return res.status(500).json({ error: FindUserError });
    });
};
