const userModel = require('../api/users/userModel');
const movieModel = require('../api/movies/movieModel');
const {movies} = require('./movies');

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
  console.log(movies.length);
  try {
    await movieModel.deleteMany();
    await movieModel.collection.insertMany(movies);
    console.info(`${movies.length} Movies were successfully stored.`);
  } catch(err) {
    console.error(`failed to load Movie Data: ${err}`);
  }
}

module.exports = {loadUsers, loadMovies}