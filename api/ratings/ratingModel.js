const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RatingSchema = new Schema({
  rate: {type: Number},
  tv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TVs'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Ratings', RatingSchema)