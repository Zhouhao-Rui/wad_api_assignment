const userModel = require('../api/users/userModel');
const movieModel = require('../api/movies/movieModel');
const {getMovies, getPopularTVs, getTodayTVs, getTopRatedTVs} = require('../api/tmdb-api')
const reviewModel = require('../api/reviews/reviewModel')
const authorModel = require('../api/author/authorModel')
const tvModel = require('../api/tvs/tvModel')
const ratingModel = require('../api/ratings/ratingModel');
const creatorModel = require('../api/creator/creatorModel');

const users = [
  {
    'username': 'user1',
    'password': 'Test1111',
  },
  {
    'username': 'user2',
    'password': 'Test2222',
  },
];

// delete all user documents in collection and inserts test data
const loadUsers = async () => {
  console.log("load user data");
  try {
    await userModel.deleteMany();
    await users.forEach(user => userModel.create(user));
    console.info(`${users.length} users were successfully stored.`);
  } catch(err) {
    console.error(`failed to Load user Data: ${err}`);
  }
}

const loadMovies = async () => {
  console.log('Load seed data');
  try {
    await movieModel.deleteMany();
    await authorModel.deleteMany();
    await reviewModel.deleteMany();
    await ratingModel.deleteMany();
    const movies = await getMovies();
    movies.forEach(movie => {
      movie.page = 1
    })
    await movieModel.collection.insertMany(movies);
    console.info(`${movies.length} Movies were successfully stored.`);
  } catch(err) {
    console.error(`failed to load Movie Data: ${err}`);
  }
}

const loadTvs = async () => {
  console.log('load Seed data')
  try {
    await tvModel.deleteMany();
    await creatorModel.deleteMany();
    const todayTVs = await getTodayTVs();
    const popularTVs = await getPopularTVs();
    const topRatedTVs = await getTopRatedTVs();
    todayTVs.forEach(tv => {
      tv.todayPage = 1
    })
    popularTVs.forEach(tv => {
      tv.popularPage = 1
    })
    topRatedTVs.forEach(tv => {
      tv.topRatedPage = 1
    })
    await tvModel.collection.insertMany(todayTVs)
    popularTVs.forEach(async tv => {
      const isExist = await tvModel.findOne({ "id": tv.id })
      if (!isExist) {
        await tvModel.create(tv)
      } else {
        await tvModel.findOneAndUpdate({ "id": tv.id }, { "popularPage": 1 })
      }
    })
    topRatedTVs.forEach(async tv => {
      const isExist = await tvModel.findOne({"id": tv.id})
      if (!isExist) {
        await tvModel.create(tv)
      } else {
        await tvModel.findOneAndUpdate({ "id": tv.id }, { "topRatedPage": 1 })
      }
    })
    console.info(`tvs were successfully stored.`);
  } catch(err) {
    console.error(`failed to load tv Data: ${err}`);
  }
  
}

module.exports = {loadUsers, loadMovies, loadTvs}