const express = require('express');
const {
	getMovieReviews
} = require('../tmdb-api');
const movieModel = require('./movieModel');

const router = express.Router(); // eslint-disable-line

router.get('/', (req, res, next) => {
	try {
		movieModel.find().then(movies => res.status(200).send(movies))
	} catch(err) {
		next(err)
	}
	
});

router.get('/:id', (req, res, next) => {
	const id = parseInt(req.params.id);
	movieModel.findByMovieDBId(id).then(movie => res.status(200).send(movie)).catch(err => next(err));
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
	getMovieReviews(id)
	.then(reviews => res.status(200).send(reviews))
	.catch(err => next(err));
});

module.exports = router;

