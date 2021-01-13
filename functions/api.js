const dotenv = require('dotenv');
const express = require('express');
const moviesRouter = require('../api/movies');
const bodyParser = require('body-parser');
require('./db');
const loglevel = require('loglevel');
const { loadUsers } = require('../seedData');
const { loadMovies } = require('../seedData')
const { loadTvs } = require('../seedData')
const UsersRouter = require('../api/users');
const GenresRouter = require('../api/genres');
const { passport } = require('../authenticate');
const serverless = require('serverless-http');
const optimizelyExpress = require('@optimizely/express')
const TVRouter = require('../api/tvs')
const CreatorRouter = require('../api/creator')
const helmet = require('helmet')
const cors = require('cors')

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
  loadTvs();
}

const app = express();
app.use(helmet())
app.use(cors())

const optimizely = optimizelyExpress.initialize({
  sdkKey: 'B6VqZnG6CLmjLh2MDZEiX',
  datafileOptions: {
    autoUpdate: true,      // Indicates feature flags will be auto-updated based on UI changes 
    updateInterval: 1 * 1000 // 1 second in milliseconds
  },
  logLevel: 'info',        // Controls console logging. Can be 'debug', 'info', 'warn', or 'error'
});

app.use(optimizely.middleware);
app.use(passport.initialize());

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.use('/.netlify/functions/api/movies', moviesRouter);
app.use('/.netlify/functions/api/users', UsersRouter);
app.use('/.netlify/functions/api/genres', GenresRouter);
app.use('/.netlify/functions/api/tvs', function(req, res, next) {
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
app.use('/.netlify/functions/api/creators', function(req, res, next) {
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

module.exports.handler = serverless(app);