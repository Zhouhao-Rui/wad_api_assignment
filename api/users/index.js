const express = require('express');
const User = require('./userModel');
const jwt = require('jsonwebtoken');
const movieModel = require('../movies/movieModel');
const ratingModel = require('../ratings/ratingModel')
const { passport } = require('../../authenticate');
const tvModel = require('../tvs/tvModel');
const userModel = require('./userModel');

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
    return;
  }
  if (req.query.action === 'register') {
    try {
      await User.create(req.body)
    } catch (err) {
      res.status(401).send({ code: 401, msg: 'Fail to create a user, please enter valid password' })
      return;
    }

    res.status(201).json({
      code: 201,
      msg: 'Successful created new user',
    });
    return;
  } else {
    const user = await User.findByUserName(req.body.username).catch(next);
    if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        // if user is found and password is right create a token
        const token = jwt.sign(user.username, process.env.SECRET);
        res.status(200).json({
          success: true,
          token: 'BEARER ' + token,
          username: user.username
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

  User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    upsert: false
  }).then(user => res.json(200, user)).catch(err => next(err));
});

router.get('/:userName/favourites', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('favourites').then(
    user => res.status(201).json(user.favourites)
  ).catch(next);
});

router.post('/:userName/favourites', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
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

router.post('/:userName/ratings', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const ratingTV = parseInt(req.body.id);
  const rating = parseInt(req.body.rating);
  const userName = req.params.userName;
  let isExist;
  if (rating > 10 || rating < 0) {
    res.status(401).send({
      code: 401,
      msg: 'The rating mark is not valid!'
    })
    return;
  }
  // query the model to search whether the tv has been rated
  await ratingModel.find({}).populate("tv").populate("user").exec(async (err, docs) => {
    if (err) {
      next(err)
    } else {
      docs.forEach(async (doc, index) => {
        isExist = (doc.tv.id == ratingTV && doc.user.username == userName) || false;
        if (isExist) {
          console.log('UPDATE rate')
          doc.rate = rating;
          await doc.save();
          res.status(200).send(doc);
        }
      })
      try {
        const tv = await tvModel.findOne({ "id": ratingTV })
        const user = await User.findByUserName(userName)
        const rateObj = {
          rate: rating,
          tv: tv._id,
          user: user._id
        }
        if (!isExist) {
          console.log('POST rate')
          const rated_tv = await ratingModel.create(rateObj)
          await user.ratings.push(rated_tv._id)
          await user.save();
          await tv.ratings.push(rated_tv._id)
          await tv.save();
          res.status(201).send(rateObj)
        }
      } catch (err) {
        next(err)
      }
    }
  })

})

router.get('/:userName/ratings', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate({
    "path": "ratings",
    "populate": {
      "path": "tv",
      "model": "TVs"
    }
  }).then(
    user => res.status(201).json(user.ratings)
  ).catch(next);
})

router.get("/:username/ratings/:id", async (req, res, next) => {
  const username = req.params.username;
  try {
    const id = parseInt(req.params.id)
    const user = await User.findByUserName(username);
    const tv = await tvModel.findOne({id: id})
    ratingModel.findOne({user: user._id, tv: tv._id})
    .then(
      rating => res.status(201).json(rating)
    ).catch(next);
  } catch (err) {
    next(err)
  }
  
})

router.delete('/:userName/ratings', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const userName = req.params.userName;
  const id = parseInt(req.query.id)
  try {
    const user = await User.findByUserName(userName);
    const tv = await tvModel.findOne({id: id})
    await ratingModel.findOneAndDelete({user: user._id, tv: tv._id})
    res.status(200).send("Delete success")
  }catch(err) {
    next(err)
  }
  
})

router.post('/:username/list', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const username = req.params.username
  const name = req.body.name
  const title = req.body.title || ""
  try {
    const user = await User.findByUserName(username)
    await user.list.push({
      name: name,
      title: title,
      id: user.list.length + 1
    })
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    next(err)
  }
})

router.post('/:username/list/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const username = req.params.username
  const id = parseInt(req.params.id)
  const tv = parseInt(req.body.id)
  try {
    const user = await User.findByUserName(username)
    const found_tv = await tvModel.findOne({ "id": tv })
    user.list.forEach(async (item, index) => {
      if (item.id == id) {
        if (item.tvs.includes(found_tv._id)) {
          res.status(401).send({
            code: 401,
            msg: 'The tv has been added'
          })
        } else {
          item.tvs.push(found_tv._id)
          await user.save();
          res.status(200).send(user)
        }
      }
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:username/list/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const username = req.params.username
  const id = req.params.id
  try {
    const user = await User.findByUserName(username).populate({
      path: "list",
      model: "User",
      populate: {
        path: "tvs",
        model: 'TVs'
      }
    })
    user.list.forEach((item, index) => {
      if (item.id == id) {
        res.status(200).send(item)
      } else {
        res.status(401).send({
          code: 401,
          msg: 'Not Found'
        })
      }
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:username/list', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const username = req.params.username
  try {
    const user = await User.findByUserName(username).populate({
      path: "list",
      model: "User",
      populate: {
        path: "movies",
        model: 'Movies'
      }
    })
    res.status(200).send(user.list)
  } catch (err) {
    next(err)
  }
})

module.exports = router;