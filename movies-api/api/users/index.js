import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import movieModel from '../movies/movieModel';

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
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    if (!pattern.test(req.body.password)) {
      res.status(401).send('The password is too weak. It should contain at 5 chars and at least 1 number and 1 char');
    } else {
      await User.create(req.body).catch(next);
      res.status(201).json({
        code: 201,
        msg: 'Successful created new user',
      });
    }
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

// update a user
router.put('/:id', (req, res, next) => {
  if (req.body._id) {
    delete req.body._id;
  }
  User.update({
    _id: req.params.id,
  }, req.body, {
    upsert: false
  })
    .then(user => res.json(200, user))
    .catch(err => next(err));
});

router.get('/:userName/favourites', (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('favourites').then(
    user => res.status(201).json(user.favourites)
  ).catch(next);
});

router.post('/:userName/favourites', async (req, res, next) => {
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
  } catch(err) {
    next(err);
  }
  
});
export default router;