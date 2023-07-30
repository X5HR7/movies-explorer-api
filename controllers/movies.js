const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const DefaultServerError = require('../errors/DefaultServerError');
const ValidationError = require('../errors/ValidationError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user })
    .then(movies => res.status(200).send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then(movie => res.status(201).send({ data: movie }))
    .catch(err => {
      if (err.name === 'ValidationError') next(new ValidationError('Переданы некорректные данные'));
      else next(new DefaultServerError('На сервере произошла ошибка'));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then(movie => {
      if (!movie) throw new NotFoundError('Фильм по данному id не найдена');

      if (movie.owner._id.toString() !== req.user._id) throw new ForbiddenError('Нет прав на удаление фильма');

      Movie.findByIdAndDelete(req.params.id)
        .then(movie => res.status(200).send({ data: movie }))
        .catch(next);
    })
    .catch(err => {
      if (err.name === 'CastError') throw new ValidationError('Передан невалидный id');
      else next(err);
    });
};
