const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_KEY = '54bc67bb5cc0f214674313e60dbd0e9707a9e7f3b068bdda5b3050e9a83f4ab4' } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      User.create({ email, password: hash, name })
        .then(user => res.status(201).send({ data: { email: user.email, name: user.name } }))
        .catch(err => {
          console.log(err); //Error
        });
    })
    .catch(err => {
      console.log(err); //Error
    });

};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then(user => res.status(200).send({ data: user }))
    .catch(err => {
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(data => res.status(200).send({ data: data }))
    .catch(err => {
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => res.status(200).send(user))
    .catch(err => {
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
  res
    .status(200)
    .cookie('jwt', '')
    .send({ message: 'Logged out' });
};
