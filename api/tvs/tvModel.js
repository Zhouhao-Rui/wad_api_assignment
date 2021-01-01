const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TVSchema = new Schema({
  backdrop_path: { type: String },
  first_air_date: {type: String},
  genre_ids: [{type: Number}],
  id: {type: Number, unique: true},
  name: {type: String},
  origin_country: [
    {type: String}
  ],
  original_language: {type: String},
  original_name: {type: String},
  overview: {type: String},
  popularity: {type: Number},
  poster_path: {type: String},
  vote_average: {type: Number},
  vote_count: {type: Number},
  todayPage: {type: Number},
  popularPage: {type: Number},
  topRatedPage: {type: Number},
  hot: {type: Boolean},
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ratings'
  }]
})

module.exports = mongoose.model('TVs', TVSchema)