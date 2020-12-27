const express = require('express');

const { getGenres } = require('../tmdb-api');

const router = express.Router();

router.get('/', (req, res, next) => {
  getGenres()
    .then(genres => {
      res.status(200).send(genres);
    })
    .catch(err => next(err));
});

module.exports = router;