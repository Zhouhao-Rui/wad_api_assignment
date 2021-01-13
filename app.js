const express = require('express')
const swaggerUI = require('swagger-ui-express')
const dotenv = require('dotenv')
const swaggerDocument = require('./swagger.json')
const { passport } = require('./authenticate')
require('./db')
import { loadUsers, loadMovies, loadTvs } from './seedData';
import usersRouter from './api/users';
import GenresRouter from './api/genres';
import TVRouter from './api/tvs';
import CreatorRouter from './api/creator'
import moviesRouter from './api/movies';
import bodyParser from 'body-parser';
const optimizelyExpress = require('@optimizely/express');
const helmet = require('helmet')
const cors = require("cors")

const app = express()

app.use(helmet())
app.use(cors())

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

dotenv.config()

const errHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json("Something went wrong!");
  }
  res.status(500).json(`Hey!! You caught the error 👍👍, ${err.stack} `);
};

if (process.env.SEED_DB === 'true') {
  loadMovies();
  loadUsers();
  loadTvs();
}

const optimizely = optimizelyExpress.initialize({
  sdkKey: 'B6VqZnG6CLmjLh2MDZEiX',
  datafileOptions: {
    autoUpdate: true,      // Indicates feature flags will be auto-updated based on UI changes 
    updateInterval: 1*1000 // 1 second in milliseconds
  },
  logLevel: 'info',        // Controls console logging. Can be 'debug', 'info', 'warn', or 'error'
});


app.use(optimizely.middleware);
app.use(passport.initialize());

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.use('/api/movies', moviesRouter);
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

  if (isEnabled) {
    next();
  }
}, TVRouter);
app.use('/api/creators', function(req, res, next) {
  const isEnabled = req.optimizely.client.isFeatureEnabled(
    'tv', 
    'user123',
    {
      customerId: 123,
      isVip: true
    }
  )

  if (isEnabled) {
    next();
  }
}, CreatorRouter)

app.use(errHandler);

const server = app.listen(process.env.PORT, () => {
  console.info(`Server running at ${process.env.PORT}`);
});

module.exports = server;