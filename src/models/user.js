const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Token = require('./token');

const UserSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      first_name: String,
      last_name: String,
      address: String,
      telephone: String,
    },
    orders: [{ id: mongoose.Types.ObjectId }],
    active: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: Number,
      default: 0,
      min: 0,
      max: 16,
    },

    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      resetPasswordToken: String,
      resetPasswordExpires: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10, (BcryptHashError, hash) => {
    if (BcryptHashError) return next(BcryptHashError);

    this.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  const payload = {
    id: this._id,
    email: this.email,
    permission: this.permission,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

UserSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString('hex'),
  };

  return new Token(payload);
};

module.exports = mongoose.model('User', UserSchema);
