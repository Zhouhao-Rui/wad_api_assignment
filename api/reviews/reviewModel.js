const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: "Authors"},
  content: {type: String},
  created_at: {type: Date, default: Date.now},
  id: {type: String},
  update_at: {type: Date, default: Date.now},
  url: {type: String},
})

module.exports = mongoose.model('Reviews', ReviewSchema)