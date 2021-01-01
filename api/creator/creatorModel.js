const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CreatorSchema = new Schema({
  credit_id: {type: String},
  id: {type: Number},
  name: {type: String},
  tvs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TVs'
  }],
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movies'
  }],
  known_for_department: {type: String},
  profile_path: {type: String},
  popularity: {type: Number}
})

module.exports = mongoose.model('Creators', CreatorSchema)