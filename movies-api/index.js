import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import bodyParser from 'body-parser';
import './db';
import { loadUsers, loadMovies } from './seedData';
import usersRouter from './api/users';
import GenresRouter from './api/genres';
import passport from './authenticate';

dotenv.config();

const errHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).send("Something went wrong!");
  }
  res.status(500).send(`Hey!! You caught the error 👍👍, ${err.stack} `);
};

if (process.env.SEED_DB) {
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

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});