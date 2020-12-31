import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import bodyParser from 'body-parser';
import './db';
import loglevel from 'loglevel';
import { loadUsers, loadMovies } from './seedData';
import usersRouter from './api/users';
import GenresRouter from './api/genres';
import TVRouter from './api/tvs';
const {passport} = require('./authenticate');
const optimizelyExpress = require('@optimizely/express');

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

const optimizely = optimizelyExpress.initialize({
  sdkKey: 'B6VqZnG6CLmjLh2MDZEiX',
  datafileOptions: {
    autoUpdate: true,      // Indicates feature flags will be auto-updated based on UI changes 
    updateInterval: 1*1000 // 1 second in milliseconds
  },
  logLevel: 'info',        // Controls console logging. Can be 'debug', 'info', 'warn', or 'error'
});

const port = process.env.PORT;

app.use(optimizely.middleware);
app.use(passport.initialize());

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/users', usersRouter);
app.use('/api/genres', GenresRouter);
app.use('/api/tvs', function(req, res, next) {
  const isEnabled = req.optimizely.client.isFeatureEnabled(
    'tv', 
    'user123',
    {
      customerId: 123,
      isVip: true
    }
  )

  res.send('Optimizely Express Example: ' +  (isEnabled ? next() : 'Feature off.'))
}, TVRouter);

app.use(errHandler);

const server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

module.exports = server;