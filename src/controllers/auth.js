require('dotenv').config();

// node_modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Custom variables
const Utils = require('../utils');
const User = require('../models/user');
const { sendEmail } = require('../utils/mail');
const utils = require('../utils');

/**
 * Login user and return JWT
 * @route POST /api/auth/login
 * @param req.body.email
 * @param req.body.password
 * @access Public
 */
exports.login = (req, res, next) => {
  const ValidatorError = utils.validator.validateEmailAndPassword(req.body);
  if (ValidatorError)
    return res.json({
      success: false,
      error: ValidatorError,
    });

  User.findOne({ email: req.body.email })
    .exec()
    .then((_user) => {
      if (!_user)
        return res.json({ error: { message: 'Incorrect email or password.' } });

      _user
        .comparePassword(req.body.password)
        .then((result) => {
          const token = _user.generateJWT();

          res.json({
            success: true,
            message: 'Auth Successful.',
            token: token,
          });
        })
        .catch((ComparePasswordError) => {
          return res.json({
            success: false,
            error: {
              message: 'Incorrect email or password.',
              error: ComparePasswordError,
            },
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

/**
 * Register user
 * @route POST /api/auth/register
 * @param req.body.email
 * @param req.body.password
 * @access Public
 */
exports.register = (req, res, next) => {
  const ValidatorError = utils.validator.validateEmailAndPassword(req.body);
  if (ValidatorError)
    return res.json({
      success: false,
      error: ValidatorError,
    });

  User.findOne({ email: req.body.email })
    .exec()
    .then((_user) => {
      if (_user)
        return res.json({
          success: false,
          error: { message: 'Email already taken.' },
        });

      const NewUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password,
      });

      NewUser.save()
        .then((CreatedUser) =>
          sendVerificationEmail(CreatedUser)
            .then((mail) =>
              res.status(201).json({
                success: true,
                user: {
                  _id: CreatedUser._id,
                  active: CreatedUser.active,
                  email: CreatedUser.email,
                  permission: CreatedUser.permission,
                },
                mail: mail[0],
              })
            )
            .catch((SendEmailError) =>
              res.status(201).json({
                success: true,
                user: {
                  _id: CreatedUser._id,
                  active: CreatedUser.active,
                  email: CreatedUser.email,
                  permission: CreatedUser.permission,
                },
                error: {
                  message: 'Can not send email.',
                  SendEmailError,
                },
              })
            )
        )
        .catch((NewUserSaveError) => {
          return res.status(500).json({
            success: false,
            error: {
              message: NewUserSaveError,
              user: NewUser,
              info:
                process.env.NODE_ENV === 'production'
                  ? '😒'
                  : 'Can not save new user.',
            },
          });
        });
    })
    .catch((FindUserError) => {
      return res.status(500).json({
        success: false,
        error: {
          message: FindUserError,
          info:
            process.env.NODE_ENV === 'production' ? '😒' : 'Can not find user.',
        },
      });
    });
};

/**
 * Verifi token
 * @route POST /api/verify/:token
 * @param req.params.token
 * @access Public
 */
exports.verifiToken = (req, res, next) => {};

/**
 * Send new token to user
 * @route POST /api/verify
 * @param req.body.email
 * @access Public
 */
exports.sendToken = (req, res, next) => {
  const ValidatorError = utils.validator.validateEmail(req.body);
  if (ValidatorError)
    return res.json({
      success: false,
      error: ValidatorError,
    });

  User.findOne({ email: req.body.email })
    .exec()
    .then((_user) => {
      sendVerificationEmail(_user)
        .then((mail) =>
          res.json({
            success: true,
            mail: mail[0],
          })
        )
        .catch((SendEmailError) =>
          res.json({
            success: false,
            error: {
              message: 'Can not send email',
              SendEmailError,
            },
          })
        );
    })
    .catch((UserFindError) => {
      return res.json({
        success: false,
        error: {
          message: UserFindError,
        },
      });
    });
};

/**
 * Send verification email to User
 * @param User
 * @access Private
 */
function sendVerificationEmail(_user) {
  return new Promise((resolve, reject) => {
    _user
      .generateVerificationToken()
      .save()
      .then((SavedToken) => {
        const verifiLink = `http://${process.env.HOST}/api/auth/verify/${SavedToken.token}`;

        console.log('===============================================');
        console.log('dir: ' + __dirname);
        console.log('file: ' + __filename);
        console.log('html: ' + path.join(__dirname, '\\email.html'));
        console.log('===============================================');

        let params = {
          subject: 'Подтверждение аккаунта',
          to: _user.email,
          from: process.env.FROM_EMAIL,
          html: fs
            .readFileSync(path.join(__dirname, '\\email.html'), 'utf-8')
            .replace('$LINK', verifiLink),
        };

        sendEmail(params)
          .then((SendEmailResult) => {
            resolve(SendEmailResult);
          })
          .catch((SendEmailError) => {
            reject(SendEmailError);
          });
      })
      .catch((TokenSaveError) => {
        reject(TokenSaveError);
      });
  });
}