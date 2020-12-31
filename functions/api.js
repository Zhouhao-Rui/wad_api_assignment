const dotenv = require('dotenv');
const express = require('express');
const moviesRouter = require('../api/movies');
const bodyParser = require('body-parser');
require('./db');
const loglevel = require('loglevel');
const { loadUsers } = require('../seedData');
const { loadMovies } = require('../seedData')
const UsersRouter = require('../api/users');
const GenresRouter = require('../api/genres');
const { passport } = require('../authenticate');
const serverless = require('serverless-http');
const optimizelyExpress = require('@optimizely/express')

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

app.use(optimizely.middleware);


app.use(passport.initialize());

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.use('/.netlify/functions/api/movies', passport.authenticate('jwt', { session: false }), moviesRouter);
app.use('/.netlify/functions/api/users', UsersRouter);
app.use('/.netlify/functions/api/genres', GenresRouter);

app.use(errHandler);

module.exports.handler = serverless(app);