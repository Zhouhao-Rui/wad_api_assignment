const express = require('express');
const creatorModel = require('./creatorModel')
const movieModel = require('../movies/movieModel')
const tvModel = require('../tvs/tvModel')
const { getCreator } = require('../tmdb-api')

const router = express.Router(); // eslint-disable-line

router.get('/:id', async (req, res, next) => {
  const credit_id = req.params.id
  try {
    const isCreator = await creatorModel.find({ "credit_id": credit_id }).populate("movies").populate("tvs")
    if (isCreator.length) {
      console.log("Load from database")
      res.status(200).send(isCreator)
    } else {
      console.log("Load from TMDB and store")
      const creator = await getCreator(credit_id)
      const insertObj = {
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
              insertObj.movies.push(isExistMovie._id)
            } else {
              const newMovie = await movieModel.create(media)
              insertObj.movies.push(newMovie._id)
            }
            break;
          case "tv":
            const isExistTV = await tvModel.find({ "id": media.id })
            if (isExistTV) {
              insertObj.tvs.push(isExistTV._id)
            } else {
              const newTV = await tvModel.create(media)
              insertObj.tvs.push(newTV._id)
            }
            break;
          default:
            return
        }
      })
      setTimeout(async () => {
        await creatorModel.create(insertObj)
        res.status(200).send(insertObj)
      }, 1000)
      
    }
  } catch (err) {
    next(err)
  }
})

export default router