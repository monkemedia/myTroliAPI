const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategorySchema = new Schema({
  data: [{
    type: {
      type: String,
      required: true
    },

    name: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  }]
}, { versionKey: false })

module.exports = productCategorySchema
