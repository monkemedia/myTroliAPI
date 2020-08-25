const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

module.exports = ImageSchema
