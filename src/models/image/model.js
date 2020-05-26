const mongoose = require('mongoose')
const imageSchema = require('./schema')
const fs = require('fs')
const uploadcare = require('uploadcare')(process.env.UPLOADCARE_PUBLIC_KEY, process.env.UPLOADCARE_PRIVATE_KEY)

// Create Image
imageSchema.statics.createImage = async (image) => {
  return new Promise((resolve, reject) => {
    return uploadcare.file.upload(fs.createReadStream(image.path), (error, res) => {
      if (error) {
        reject(error)
      }
      // Get image data
      return uploadcare.files.info(res.file, (err, info) => {
        if (err) {
          reject(err)
        }

        // Remove image from upload directory
        return fs.unlink(image.path, (er) => {
          if (er) {
            reject(er)
          }
          resolve(info)
        })
      })
    })
  })
}

// Get Images
imageSchema.statics.findImages = async () => {
  return new Promise((resolve, reject) => {
    return uploadcare.files.list({ page: 1, limit: 100 }, (err, info) => {
      err ? reject(err) : resolve(info)
    })
  })
}

// Get Image
imageSchema.statics.findImage = async (image) => {
  return new Promise((resolve, reject) => {
    return uploadcare.files.info(image, (err, info) => {
      err ? reject(err) : resolve(info)
    })
  })
}

// Store Image
imageSchema.statics.storeImage = async (image) => {
  return new Promise((resolve, reject) => {
    return uploadcare.files.store(image, (err, info) => {
      err ? reject(err) : resolve(info)
    })
  })
}

// Delete image
imageSchema.statics.deleteImage = async (image) => {
  return new Promise((resolve, reject) => {
    return uploadcare.files.remove(image, (err, info) => {
      err ? reject(err) : resolve(info)
    })
  })
}

const Image = mongoose.model('Image', imageSchema)

module.exports = Image
