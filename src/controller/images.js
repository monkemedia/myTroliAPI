
const uploadcare = require('uploadcare')(process.env.UPLOADCARE_PUBLIC_KEY, process.env.UPLOADCARE_PRIVATE_KEY)
const fs = require('fs')
const errorHandler = require('../utils/errorHandler')

const uploadImage = (req, res) => {
  const image = req.file
  const type = req.body.type

  if (!image) {
    return res.status(401).send({
      message: 'Image is required'
    })
  }

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'image') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  // Upload image to uploadcare
  uploadcare.file.upload(fs.createReadStream(image.path), (error, response) => {
    if (error) {
      return res.status(401).send(errorHandler(401, error))
    }

    // Get image data
    uploadcare.files.info(response.file, (err, info) => {
      if (err) {
        return res.status(401).send(errorHandler(401, error))
      }

      // Remove image from upload directory
      fs.unlink(image.path, (er) => {
        if (er) {
          return res.status(401).send(errorHandler(401, er))
        }
        return res.status(201).send(info)
      })
    })
  })
}

const getImages = (req, res) => {
  uploadcare.files.list({ page: 1, limit: 100 }, (err, info) => {
    if (err) {
      return res.status(401).send(errorHandler(401, err))
    }
    return res.status(201).send(info)
  })
}

const getImage = (req, res) => {
  const image = req.params.imageId

  uploadcare.files.info(image, (err, info) => {
    if (err) {
      return res.status(401).send(errorHandler(401, err))
    }
    return res.status(201).send(info)
  })
}

const deleteImage = (req, res) => {
  const image = req.params.imageId

  uploadcare.files.remove(image, (err, info) => {
    if (err) {
      return res.status(401).send(errorHandler(401, err))
    }
    return res.status(201).send({ message: 'Image has been deleted' })
  })
}

const storeImages = async (req, res) => {
  const images = req.body

  const promises = images.map(async (id) => {
    return new Promise((resolve, reject) => {
      return uploadcare.files.store(id, (err, info) => {
        if (err) {
          reject(new Error(err))
        }
        resolve(info)
      })
    })
  })

  try {
    const results = await Promise.all(promises)
    res.status(201).send(results)
  } catch (err) {
    res.status(401).send(errorHandler(401, err))
  }
}

module.exports = {
  uploadImage,
  getImages,
  getImage,
  deleteImage,
  storeImages
}
