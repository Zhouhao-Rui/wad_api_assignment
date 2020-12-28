import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import bodyParser from 'body-parser';
import './db';
import loglevel from 'loglevel';
import { loadUsers, loadMovies } from './seedData';
import usersRouter from './api/users';
import GenresRouter from './api/genres';
const {passport} = require('./authenticate');

dotenv.config();

if (process.env.NODE_ENV === 'test') {
  loglevel.setLevel('warn')
} else {
  loglevel.setLevel('info')
}

const errHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json("Something went wrong!");
  }
  res.status(500).json(`Hey!! You caught the error 👍👍, ${err.stack} `);
};

if (process.env.SEED_DB === 'true') {
  loadUsers();
  loadMovies();
}

const app = express();

const port = process.env.PORT;

app.use(passport.initialize());

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/users', usersRouter);
app.use('/api/genres', GenresRouter);

app.use(errHandler);

const server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

module.exports = server;