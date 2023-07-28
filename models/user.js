const mongoose = require('mongoose');
const dataValidator = require('validator');

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

module.exports = mongoose.model('user', userSchema);
