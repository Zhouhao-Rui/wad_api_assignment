const express = require('express')
const swaggerUI = require('swagger-ui-express')
const dotenv = require('dotenv')
const swaggerDocument = require('./swagger.json')
const { passport } = require('./authenticate')
require('./db')
const movieModel = require('./api/movies/movieModel');
const {getMovieReviews} = require('./api/tmdb-api')
const {loadMovies, loadUsers} = require("./seedData");
const User = require('./api/users/userModel')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

const app = express()

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
}

if (process.env.SEED_DB === 'true' && process.env.NODE_ENV === "development") {
  loadUsers();
}

app.get('/api/movies', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.send([
    {
      "adult": false,
      "backdrop_path": "/jeAQdDX9nguP6YOX6QSWKDPkbBo.jpg",
      "genre_ids": [
        28,
        14,
        878
      ],
      "id": 590706,
      "original_language": "en",
      "original_title": "Jiu Jitsu",
      "overview": "Every six years, an ancient order of jiu-jitsu fighters joins forces to battle a vicious race of alien invaders. But when a celebrated war hero goes down in defeat, the fate of the planet and mankind hangs in the balance.",
      "popularity": 2633.943,
      "poster_path": "/eLT8Cu357VOwBVTitkmlDEg32Fs.jpg",
      "release_date": "2020-11-20",
      "title": "Jiu Jitsu",
      "video": false,
      "vote_average": 5.9,
      "vote_count": 111
    },
    {
      "adult": false,
      "backdrop_path": "/vam9VHLZl8tqNwkp1zjEAxIOrkk.jpg",
      "genre_ids": [
        10751,
        14,
        10770
      ],
      "id": 671583,
      "original_language": "en",
      "original_title": "Upside-Down Magic",
      "overview": "Nory and her best friend Reina enter the Sage Academy for Magical Studies, where Nory’s unconventional powers land her in a class for those with wonky, or “upside-down,” magic. Undaunted, Nory sets out to prove that that upside-down magic can be just as powerful as right-side-up.",
      "popularity": 2362.99,
      "poster_path": "/xfYMQNApIIh8KhpNVtG1XRz0ZAp.jpg",
      "release_date": "2020-07-31",
      "title": "Upside-Down Magic",
      "video": false,
      "vote_average": 7.6,
      "vote_count": 64
    },
    {
      "id": "....."
    }
  ]).catch(next)
})

app.get('/api/movies/:id', passport.authenticate("jwt", { session: false }), (req, res, next) => {
  const id = parseInt(req.params.id);
  movieModel.findByMovieDBId(id).then(movie => res.status(200).send(movie)).catch(err => next(err));
})

app.get('/api/movies/:id/reviews', passport.authenticate("jwt", { session: false }), (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieReviews(id)
    .then(reviews => res.status(200).send(reviews))
    .catch(err => next(err));
})

app.get('/api/users', (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => next(err));
})

app.post('/api/users', async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json({
      success: false,
      msg: 'Please pass username and password',
    });
  }
  if (req.query.action === 'register') {
    await User.create(req.body).catch(next);
    res.status(201).json({
      code: 201,
      msg: 'Successful created new user',
    });
  } else {
    const user = await User.findByUserName(req.body.username).catch(next);
    if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        // if user is found and password is right create a token
        const token = jwt.sign(user.username, process.env.SECRET);
        res.status(200).json({
          success: true,
          token: 'BEARER ' + token
        });
      } else {
        res.status(401).json({
          code: 401,
          msg: 'Authentication failed. Wrong password.'
        });
      }
    });
  }
})

app.delete("/api/users/:username", (req, res, next) => {
  User.findOneAndDelete({ username: req.params.username }, (err, docs) => {
    if (err || !docs) {
      res.status(401).json({
        code: 401,
        msg: 'Fail to delete the user'
      })
    } else {
      res.status(200).json({
        msg: 'Deleted User: ' + docs.username
      })
    }
  })
})

app.get("/api/users/:userName/favourites", passport.authenticate('jwt', {session: false}, (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('favourites').then(
    user => res.status(201).json(user.favourites)
  ).catch(next);
}))

app.post("/api/users/:userName/favourites", passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const newFavourite = req.body.id;
  const userName = req.params.userName;
  try {
    const movie = await movieModel.findByMovieDBId(newFavourite)
    const user = await User.findByUserName(userName)
    // judge whether the movie has been collected
    if (user.favourites.includes(movie._id)) {
      res.status(401).json({ code: 401, msg: 'this movie has been added to favourite' });
    } else {
      await user.favourites.push(movie._id);
      await user.save();
      res.status(201).json(user);
    }
  } catch (err) {
    next(err);
  }
})

app.put('/api/users/:id', (req, res, next) => {
  if (req.body._id) {
    delete req.body._id;
  }
  User.findOneAndUpdate({_id: req.params.id}, req.body, {
    upsert: false
  }).then(user => res.json(200, user)).catch(err => next(err));
});

app.use(errHandler);

const server = app.listen(process.env.PORT, () => {
  console.info(`Server running at ${process.env.PORT}`);
});

module.exports = server;