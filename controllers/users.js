const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const UnavailableEmailError = require('../errors/UnavailableEmailError');
const DefaultServerError = require('../errors/DefaultServerError');
const NotFoundError = require('../errors/NotFoundError');
const errorMessages = require('../utils/errorMessages');
const { JWT_KEY = '54bc67bb5cc0f214674313e60dbd0e9707a9e7f3b068bdda5b3050e9a83f4ab4' } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then(hash => {
      User.create({ email, password: hash, name })
        .then(user => res.status(201).send({ data: { email: user.email, name: user.name } }))
        .catch(err => {
          if (err.name === 'ValidationError') next(new ValidationError(errorMessages.validationError));
          else if (err.name === 'MongoServerError' && err.code === 11000)
            next(new UnavailableEmailError(errorMessages.unavailableEmailError));
          else next(new DefaultServerError(errorMessages.defaultServerError));
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then(user => {
      if (user) res.status(200).send({ data: user });
      else next(new NotFoundError(errorMessages.notFoundError));
    })
    .catch(err => {
      if (err.name === 'ValidationError') next(new ValidationError(errorMessages.validationError));
      else if (err.name === 'MongoServerError' && err.code === 11000)
        next(new UnavailableEmailError(errorMessages.unavailableEmailError));
      else next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (user) res.status(200).send({ data: { email: user.email, name: user.name } });
      else throw new NotFoundError(errorMessages.notFoundError);
    })
    .catch(err => {
      if (err.name === 'CastError') next(new ValidationError(errorMessages.validationError));
      else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, JWT_KEY, { expiresIn: '7d' });

      res
        .status(200)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true
        })
        .send({ data: token });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  res.status(200).cookie('jwt', '').send({ message: 'Logged out' });
};
