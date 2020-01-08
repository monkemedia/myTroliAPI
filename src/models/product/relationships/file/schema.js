const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productFileRelationshipSchema = new Schema({
  data: [{
    _id: false,
    type: {
      type: String,
      required: true
    },
    file_id: {
      type: String,
      required: true,
      unique: true
    }
  }]
})

module.exports = productFileRelationshipSchema
