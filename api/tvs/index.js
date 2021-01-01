const express = require('express');

const { getTodayTvsByPage, getPopularTVsByPage, getTopRatedTVsByPage, getHotTVs, getTVDetails } = require('../tmdb-api');
const tvModel = require('./tvModel');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tvs = await tvModel.find({})
    res.status(200).send(tvs)
  }catch(err) {
    next(err)
  }
})

router.get('/todaytv/page/:page', async (req, res, next) => {
  const page = parseInt(req.params.page)
  const sortMethod = req.query.sort
  const tv = await tvModel.findOne({ "todayPage": page }).catch(err => next(err))
  if (tv) {
    console.log('Load in the database')
    switch (sortMethod) {
      case 'popularity':
        tvModel.find({ "todayPage": page }).sort({ 'popularity': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'vote_count':
        tvModel.find({ "todayPage": page }).sort({ 'vote_count': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'vote_average':
        tvModel.find({ "todayPage": page }).sort({ 'vote_average': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'first_air_date':
        tvModel.find({ "todayPage": page }).sort({ 'first_air_date': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      default:
        tvModel.find({ "todayPage": page }).then(tvs => {
          res.status(200).send(tvs)
        }).catch(err => next(err))
    }
  } else {
    // store movies
    console.log('Load from the TMDB and store')
    const tvs = await getTodayTvsByPage(page)
    // insert page number
    tvs.forEach(tv => {
      tv.todayPage = page
    })
    tvs.forEach(async tv => {
      const isExist = await tvModel.findOne({ "id": tv.id })
      if (!isExist) {
        await tvModel.create(tv)
      } else {
        await tvModel.findOneAndUpdate({ "id": tv.id }, { "todayPage": page })
      }
    })
    switch(sortMethod) {
      case 'popularity':
        res.status(200).send(tvs.sort((a, b) => {
          return b.popularity - a.popularity;
        }))
        break;
      case 'vote_count':
        res.status(200).send(tvs.sort((a, b) => {
          return b.vote_count - a.vote_count
        }))
        break;
      case 'vote_average':
        res.status(200).send(tvs.sort((a, b) => {
          return b.vote_average - a.vote_average
        }))
        break;
      case 'first_air_date':
        res.status(200).send(tvs.sort((a, b) => {
          const aTime = new Date(a.first_air_date)
          const bTime = new Date(b.first_air_date)
          return bTime.getTime() - aTime.getTime()
        }))
        break;
      default:
        res.status(200).send(tvs)
    }
  }
})

router.get('/populartv/page/:page', async (req, res, next) => {
  const page = parseInt(req.params.page)
  const sortMethod = req.query.sort
  const tv = await tvModel.findOne({ "popularPage": page }).catch(err => next(err))
  if (tv) {
    console.log('Load in the database')
    switch (sortMethod) {
      case 'popularity':
        tvModel.find({ "popularPage": page }).sort({ 'popularity': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'vote_count':
        tvModel.find({ "popularPage": page }).sort({ 'vote_count': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'vote_average':
        tvModel.find({ "popularPage": page }).sort({ 'vote_average': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'first_air_date':
        tvModel.find({ "popularPage": page }).sort({ 'first_air_date': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      default:
        tvModel.find({ "popularPage": page }).then(tvs => {
          res.status(200).send(tvs)
        }).catch(err => next(err))
    }
  } else {
    // store movies
    console.log('Load from the TMDB and store')
    const tvs = await getPopularTVsByPage(page)
    // insert page number
    tvs.forEach(tv => {
      tv.popularPage = page
    })
    tvs.forEach(async tv => {
      const isExist = await tvModel.findOne({ "id": tv.id })
      if (!isExist) {
        await tvModel.create(tv)
      } else {
        await tvModel.findOneAndUpdate({ "id": tv.id }, { "popularPage": page })
      }
    })
    switch(sortMethod) {
      case 'popularity':
        res.status(200).send(tvs.sort((a, b) => {
          return b.popularity - a.popularity;
        }))
        break;
      case 'vote_count':
        res.status(200).send(tvs.sort((a, b) => {
          return b.vote_count - a.vote_count
        }))
        break;
      case 'vote_average':
        res.status(200).send(tvs.sort((a, b) => {
          return b.vote_average - a.vote_average
        }))
        break;
      case 'first_air_date':
        res.status(200).send(tvs.sort((a, b) => {
          const aTime = new Date(a.first_air_date)
          const bTime = new Date(b.first_air_date)
          return bTime.getTime() - aTime.getTime()
        }))
        break;
      default:
        res.status(200).send(tvs)
    }
  }
})

router.get('/topratedtv/page/:page', async (req, res, next) => {
  const page = parseInt(req.params.page)
  const sortMethod = req.query.sort
  const tv = await tvModel.findOne({ "topRatedPage": page }).catch(err => next(err))
  if (tv) {
    console.log('Load in the database')
    switch (sortMethod) {
      case 'popularity':
        tvModel.find({ "topRatedPage": page }).sort({ 'popularity': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'vote_count':
        tvModel.find({ "topRatedPage": page }).sort({ 'vote_count': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'vote_average':
        tvModel.find({ "topRatedPage": page }).sort({ 'vote_average': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      case 'first_air_date':
        tvModel.find({ "topRatedPage": page }).sort({ 'first_air_date': 'asc' }).exec((err, docs) => {
          if (err) {
            next(err)
          } else {
            res.status(200).send(docs)
          }
        })
        break;
      default:
        tvModel.find({ "topRatedPage": page }).then(tvs => {
          res.status(200).send(tvs)
        }).catch(err => next(err))
    }
  } else {
    // store movies
    console.log('Load from the TMDB and store')
    const tvs = await getTopRatedTVsByPage(page)
    // insert page number
    tvs.forEach(tv => {
      tv.topRatedPage = page
    })
    tvs.forEach(async tv => {
      const isExist = await tvModel.findOne({ "id": tv.id })
      if (!isExist) {
        await tvModel.create(tv)
      } else {
        await tvModel.findOneAndUpdate({ "id": tv.id }, { "topRatedPage": page })
      }
    })
    switch(sortMethod) {
      case 'popularity':
        res.status(200).send(tvs.sort((a, b) => {
          return b.popularity - a.popularity;
        }))
        break;
      case 'vote_count':
        res.status(200).send(tvs.sort((a, b) => {
          return b.vote_count - a.vote_count
        }))
        break;
      case 'vote_average':
        res.status(200).send(tvs.sort((a, b) => {
          return b.vote_average - a.vote_average
        }))
        break;
      case 'first_air_date':
        res.status(200).send(tvs.sort((a, b) => {
          const aTime = new Date(a.first_air_date)
          const bTime = new Date(b.first_air_date)
          return bTime.getTime() - aTime.getTime()
        }))
        break;
      default:
        res.status(200).send(tvs)
    }
  }
})


router.get('/hottv', async (req, res, next) => {
  try {
    const tv = await tvModel.findOne({"hot": true})
    if (tv) {
      console.log('Load from database')
      const tvs = await tvModel.find({"hot": true})
      res.status(200).send(tvs)
    } else {
      console.log('Load from TMDB and store')
      const tvs = await getHotTVs();
      // if hot tvs exist
      tvs.forEach(async tv => {
        const isExist = await tvModel.find({"id": tv.id});
        if (! isExist) {
          tv.hot = true
          await tvModel.create(tv)
        } else {
          await tvModel.findOneAndUpdate({"id": tv.id}, {"hot": true})
        }
      })
      res.status(200).send(tvs)
    }
  }catch(err) {
    next(err)
  }
})

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  tvModel.find({"id": id}).then(tv => res.status(200).send(tv)).catch(err => next(err));
})

router.get('/:id/ratings', (req, res, next) => {
  const id = parseInt(req.params.id)
  tvModel.find({"id": id}).populate({
    "path": "ratings",
    "populate": {
      "path": "user",
      "model": "User"
    }
  }).exec((err, docs) => {
    if (err) {
      next(err)
    }else {
      res.status(200).send(docs)
    }
  })
})

module.exports = router