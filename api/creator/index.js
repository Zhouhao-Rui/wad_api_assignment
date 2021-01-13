const express = require('express');
const creatorModel = require('./creatorModel')
const movieModel = require('../movies/movieModel')
const tvModel = require('../tvs/tvModel')
const { getCreator } = require('../tmdb-api')

const router = express.Router(); // eslint-disable-line

router.get('/:id', async (req, res, next) => {
  const credit_id = req.params.id
  try {
    const creator = await getCreator(credit_id)
    const updateObj = {
      credit_id: credit_id,
      id: creator.id,
      name: creator.name,
      tvs: [],
      movies: [],
      known_for_department: creator.known_for_department,
      profile_path: creator.profile_path,
      popularity: creator.popularity
    }
    creator.known_for.forEach(async media => {
      switch (media.media_type) {
        case "movie":
          const isExistMovie = await movieModel.findOne({ "id": media.id })
          if (isExistMovie) {
            updateObj.movies.push(isExistMovie._id)
          } else {
            const newMovie = await movieModel.create(media)
            updateObj.movies.push(newMovie._id)
          }
          break;
        case "tv":
          const isExistTV = await tvModel.findOne({ "id": media.id })
          if (isExistTV) {
            updateObj.tvs.push(isExistTV._id)
          } else {
            const newTV = await tvModel.create(media)
            updateObj.tvs.push(newTV._id)
          }
          break;
        default:
          return
      }
    })
    setTimeout(async () => {
      await creatorModel.findOneAndUpdate({credit_id: credit_id}, updateObj)
      const creatorInfo = await creatorModel.findOne({credit_id: credit_id}).populate("tvs").populate("movies")
      res.status(200).send(creatorInfo)
    }, 1000)
  } catch (err) {
  next(err)
}
})

module.exports = router