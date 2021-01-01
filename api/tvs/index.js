const express = require('express');

const { getTodayTvsByPage, getPopularTVsByPage, getTopRatedTVsByPage, getHotTVs, getSimilarTVs, searchTVByPage, getTVReviews } = require('../tmdb-api');
const tvModel = require('./tvModel');
const authorModel = require('../author/authorModel')
const reviewModel = require('../reviews/reviewModel')

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tvs = await tvModel.find({})
    res.status(200).send(tvs)
  } catch (err) {
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
    switch (sortMethod) {
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
    switch (sortMethod) {
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
    switch (sortMethod) {
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
    const tv = await tvModel.findOne({ "hot": true })
    if (tv) {
      console.log('Load from database')
      const tvs = await tvModel.find({ "hot": true })
      res.status(200).send(tvs)
    } else {
      console.log('Load from TMDB and store')
      const tvs = await getHotTVs();
      // if hot tvs exist
      tvs.forEach(async tv => {
        const isExist = await tvModel.find({ "id": tv.id });
        if (!isExist) {
          tv.hot = true
          await tvModel.create(tv)
        } else {
          await tvModel.findOneAndUpdate({ "id": tv.id }, { "hot": true })
        }
      })
      res.status(200).send(tvs)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  tvModel.find({ "id": id }).then(tv => res.status(200).send(tv)).catch(err => next(err));
})

router.get('/:id/ratings', (req, res, next) => {
  const id = parseInt(req.params.id)
  tvModel.find({ "id": id }).populate({
    "path": "ratings",
    "populate": {
      "path": "user",
      "model": "User"
    }
  }).exec((err, docs) => {
    if (err) {
      next(err)
    } else {
      res.status(200).send(docs)
    }
  })
})

router.get('/:id/similar', async (req, res, next) => {
  const id = parseInt(req.params.id)
  const tv = await tvModel.findOne({ "id": id }).populate("similar")
  if (tv.similar.length) {
    console.log('Load from database')
    res.status(200).send(tv.similar)
  } else {
    console.log('Load from TMDB and store')
    const tvs = await getSimilarTVs(id);
    // if hot tvs exist
    tvs.forEach(async t => {
      const existedTV = await tvModel.findOne({ "id": t.id });
      if (existedTV) {
        await tv.similar.push(existedTV._id)
        await tv.save()
      }
    })
    res.status(200).send(tvs)
  }
})

router.get('/search/:page', async (req, res, next) => {
  try {
    const page = parseInt(req.params.page)
    const query = req.query.search
    const tvs = await searchTVByPage(page, query)
    res.status(200).send(tvs)
  }catch(err) {
    next(err)
  }
  
})

router.get('/:id/reviews', async (req, res, next) => {
	const id = parseInt(req.params.id);
	try {
		const tv = await tvModel.findOne({ "id": id })
		const reviews = tv.reviews
		if (reviews.length) {
			console.log('load in the database')
			tvModel.findOne({ "id": id }).populate({
				path: 'reviews',
				model: 'Reviews',
				populate: {
					path: 'author',
					model: 'Authors'
				}
			})
				.exec((err, foundObject) => {
					if (err) {
						next(err)
					}
					res.status(200).send(foundObject.reviews)
				})
		} else {
			console.log('load from TMDB and store')
			const reviews = await getTVReviews(id)
			if (reviews.length) {
        // store the authors in author collection
        const original_authors = await authorModel.find({})
				const author_details = reviews.map(review => review.author_details)
				await authorModel.collection.insertMany(author_details)
				// store the authors in review collection
				const author_ids = await authorModel.find({}, { _id: 1 })
				reviews.forEach(async (review, index) => {
          review.author = author_ids[original_authors.length + index]
				})
				reviews.map(review => {
					delete review.author_details
				})
				// store the reviews in review collection
				await reviewModel.collection.insertMany(reviews);
				// store the reviews in movie collections
				const review_ids = await reviewModel.find({}, { _id: 1 })
				review_ids.forEach(async review_id => {
					await tv.reviews.push(review_id)
				})
				await tv.save()
				res.status(200).send(reviews)
			} else {
				res.status(200).send([])
			}

		}
	} catch (err) {
		next(err)
	}

});

module.exports = router