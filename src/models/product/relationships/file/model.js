const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productFileRelationshipSchema = require('./schema')

productFileRelationshipSchema.plugin(uniqueArrayPlugin)

// Delete file
productFileRelationshipSchema.statics.deleteFile = async (fileId) => {
  const file = await File.deleteOne({ file_id: fileId })
  return file
}

const File = mongoose.model('ProductFileRelationship', productFileRelationshipSchema)

module.exports = File
