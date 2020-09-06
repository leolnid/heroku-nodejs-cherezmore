// Node-modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Custom-modules
const Validator = require('./validator');
const Roles = require('./roles');
const Auth = require('./auth');

const createApp = () => {
  const app = express();
  app.use(morgan('short'));
  app.use(helmet());
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  return app;
};

const initMongoose = () => {
  mongoose.connect(
    `mongodb+srv://Master:${process.env.MONGODB_ATLAS_PASSWORD}@cluster0.tnrxg.mongodb.net/${process.env.MONGODB_ATLAS_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  mongoose.set('useCreateIndex', true);
};

module.exports = { Validator, Auth, Roles, createApp, initMongoose };
