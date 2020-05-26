const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = imageSchema
