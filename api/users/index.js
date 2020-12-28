const express = require('express');
const User = require('./userModel');
const jwt = require('jsonwebtoken');
const movieModel = require('../movies/movieModel');
const {passport} = require('../../authenticate')

const router = express.Router(); // eslint-disable-line

// get all users
router.get('/', (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => next(err));
});

// authenticate a user
router.post('/', async (req, res, next) => {
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
});

router.delete('/:username', (req, res, next) => {
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

// update a user
router.put('/:id', (req, res, next) => {
  if (req.body._id) {
    delete req.body._id;
  }
  
  User.findOneAndUpdate({_id: req.params.id}, req.body, {
    upsert: false
  }).then(user => res.json(200, user)).catch(err => next(err));
});

router.get('/:userName/favourites', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('favourites').then(
    user => res.status(201).json(user.favourites)
  ).catch(next);
});

router.post('/:userName/favourites', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
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

});
module.exports = router;