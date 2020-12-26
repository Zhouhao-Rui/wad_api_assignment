import userModel from '../api/users/userModel';
import movieModel from '../api/movies/movieModel';
import {movies} from './movies';

const users = [
  {
    'username': 'user1',
    'password': 'test1',
  },
  {
    'username': 'user2',
    'password': 'test2',
  },
];

// delete all user documents in collection and inserts test data
export async function loadUsers() {
  console.log("load user data");
  try {
    await userModel.deleteMany();
    await users.forEach(user => userModel.create(user));
    console.info(`${users.length} users were successfully stored.`);
  } catch(err) {
    console.error(`failed to Load user Data: ${err}`);
  }
}

export async function loadMovies() {
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