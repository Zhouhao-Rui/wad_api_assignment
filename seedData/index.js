const userModel = require('../api/users/userModel');
const movieModel = require('../api/movies/movieModel');
const {getMovies} = require('../api/tmdb-api')
const reviewModel = require('../api/reviews/reviewModel')
const authorModel = require('../api/author/authorModel')

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

module.exports = {loadUsers, loadMovies}