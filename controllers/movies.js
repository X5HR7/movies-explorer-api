const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({owner: req.user})
    .then(movies => res.status(200).send({ data: movies }))
    .catch(err => {
    });
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then(movie => res.status(201).send({ data: movie }))
    .catch(err => {
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then(movie => {
      if (!movie) throw new NotFoundError;

      if (movie.owner._id.toString() !== req.user._id) throw new ForbiddenError;

      Movie.findByIdAndDelete(req.params.id)
        .then(movie => res.status(200).send({ data: movie }))
        .catch(next);
    })
    .catch(err => {
    });
};
