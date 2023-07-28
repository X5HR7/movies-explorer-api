const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const router = require('express').Router();

router.get('/', getMovies);
router.post('/', createMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
