const express = require('express');
const {
	getMovieReviews, getMovieByPage, getUpcomingMovies
} = require('../tmdb-api');
const movieModel = require('./movieModel');
const reviewModel = require('../reviews/reviewModel')
const authorModel = require('../author/authorModel')

const router = express.Router(); // eslint-disable-line

router.get('/', (req, res, next) => {
	try {
		movieModel.find().then(movies => res.status(200).send(movies))
	} catch (err) {
		next(err)
	}
});

router.get('/page/:page', async (req, res, next) => {
	const page = parseInt(req.params.page)
	// query whether the movie has been added to the database
	try {
		const movie = await movieModel.findOne({ "page": page })
		if (movie) {
			console.log('Load in the database')
			movieModel.find({ "page": page }).then(movies => res.status(200).send(movies)).catch(err => next(err))
		} else {
			// store movies
			console.log('Load from the TMDB and store')

			const movies = await getMovieByPage(page)
			// insert page number
			movies.forEach(movie => {
				movie.page = page
			})
			await movieModel.collection.insertMany(movies)
			res.status(200).send(movies)
		} 
	}catch (err) {
		next(err)
	}
})

router.get('/:id', (req, res, next) => {
	const id = parseInt(req.params.id);
	movieModel.findByMovieDBId(id).populate("reviews").then(movie => res.status(200).send(movie)).catch(err => next(err));
});

router.get('/upcoming/:page', async (req, res, next) => {
	const page = parseInt(req.params.page)
	try {
		const movie = await movieModel.findOne({ "upcomingPage": page })
		if (movie) {
			console.log('Load in the database')
			movieModel.find({ "upcomingPage": page }).then(movies => res.status(200).send(movies)).catch(err => next(err))
		} else {
			// store movies
			console.log('Load from the TMDB and store')

			const movies = await getUpcomingMovies(page)
			// insert page number
			movies.forEach(movie => {
				movie.upcomingPage = page
			})
			movies.forEach(async movie => {
				const isExist = await movieModel.findOne({ "id": movie.id })
				if (!isExist) {
					await movieModel.create(movie)
				} else {
					await movieModel.findOneAndUpdate({ "id": movie.id }, movie)
				}
			})
			res.status(200).send(movies)
		} 
	}catch (err) {
		next(err)
	}
})

router.get('/:id/reviews', async (req, res, next) => {
	const id = parseInt(req.params.id);
	try {
		const movie = await movieModel.findOne({ "id": id })
		const reviews = movie.reviews
		if (reviews.length) {
			console.log('load in the database')
			movieModel.findOne({ "id": id }).populate({
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
			const reviews = await getMovieReviews(id)
			if (reviews.length) {
				// store the authors in author collection
				const author_details = reviews.map(review => review.author_details)
				await authorModel.collection.insertMany(author_details)
				// store the authors in review collection
				const author_ids = await authorModel.find({}, { _id: 1 })
				author_ids.forEach(async (author_id, index) => {
					reviews[index].author = author_id
				})
				reviews.map(review => {
					delete review.author_details
				})
				// store the reviews in review collection
				await reviewModel.collection.insertMany(reviews);
				// store the reviews in movie collections
				const review_ids = await reviewModel.find({}, { _id: 1 })
				review_ids.forEach(async review_id => {
					await movie.reviews.push(review_id)
				})
				await movie.save()
				res.status(200).send(reviews)
			} else {
				res.status(200).send([])
			}

		}
	} catch (err) {
		next(err)
	}

});

module.exports = router;

