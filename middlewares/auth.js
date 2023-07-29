const jwt = require('jsonwebtoken');
const { JWT_KEY = '54bc67bb5cc0f214674313e60dbd0e9707a9e7f3b068bdda5b3050e9a83f4ab4' } = process.env;
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new AuthError('Некорректный токен'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new AuthError('Некорректный токен'));
    return;
  }

  req.user = payload;
  next();
};
