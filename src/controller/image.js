
const uploadcare = require('uploadcare')(process.env.UPLOADCARE_PUBLIC_KEY, process.env.UPLOADCARE_PRIVATE_KEY)
const fs = require('fs')
const errorHandler = require('../utils/errorHandler')

const uploadImage = async (req, res) => {
  const data = req.body.data
  const file = req.file
  const { type, is_public } = data

  if (!file) {
    return res.status(401).send({
      message: 'File is required'
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

  if (!is_public) {
    return res.status(401).send({
      message: 'Public is required'
    })
  }

  // Upload image to uploadcare
  uploadcare.file.upload(fs.createReadStream(file.path), (error, response) => {
    if (error) {
      return res.status(401).send(errorHandler(401, error))
    }

    // Remove file from upload directory
    fs.unlink(file.path, (err) => {
      if (err) {
        return res.status(401).send(errorHandler(401, err))
      }

      console.log('response', response)

      return res.status(201).send({ message: 'File has been uploaded successfully' })
    })
  })
}

module.exports = {
  uploadImage
}
