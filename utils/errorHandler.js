const errorMessages = require('./errorMessages');

module.exports = (err, req, res, next) => {
  if (err && err.statusCode) res.status(err.statusCode).send({ message: err.message });
  else res.status(500).send({ message: errorMessages.defaultServerError });
};
