const mongoose = require('mongoose');
const dataValidator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/AuthError');
const errorMessages = require('../utils/errorMessages');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return dataValidator.isEmail(v);
      }
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then(user => {
      if (!user) {
        return Promise.reject(new AuthError(errorMessages.authErrorIncorrectData));
      }

      return bcrypt.compare(password, user.password)
        .then(matched => {
          if (!matched) {
            return Promise.reject(new AuthError(errorMessages.authErrorIncorrectData));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
