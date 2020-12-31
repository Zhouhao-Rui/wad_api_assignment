const express = require('express')

const {} = require('../tmdb-api')

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).send('Hello TV!')
})

module.exports = router