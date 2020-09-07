require('dotenv').config();

const utils = require('./utils');
const User = require('./models/user');

// Create app
const app = utils.createApp();
utils.initMongoose();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

app.get('/token_verification', (req, res, next) => {
  res.json({
    success: req.query.success,
    message: req.query.message,
  });
});

app.get('/', (req, res, next) => {
  res.json({
    message: 'Hello, World',
  });
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;

  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '😒' : err.stack,
    },
  });
});

// TODO: Start server only if connection to database success
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
