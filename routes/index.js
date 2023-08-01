const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required()
  })
}), createUser);

router.post('/signout', auth, logout);
router.use('/users', auth, usersRoutes);
router.use('/movies', auth, moviesRoutes);

module.exports = router;
