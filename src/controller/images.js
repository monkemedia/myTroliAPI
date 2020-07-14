const Image = require('../models/image')
const errorHandler = require('../utils/errorHandler')

const uploadImage = async (req, res) => {
  const image = req.file
  const type = req.body.type

  if (!image) {
    return res.status(401).send({
      message: 'Image is required.'
    })
  }

  if (!type) {
    return res.status(401).send({
      message: 'Type is required.'
    })
  }

  if (type && type !== 'image') {
    return res.status(401).send({
      message: 'Correct Type is required.'
    })
  }

  // Upload image to uploadcare
  try {
    const images = await Image.createImage(image)

    res.status(200).send(images)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getImages = async (req, res) => {
  try {
    const images = await Image.findImages()

    res.status(200).send(images)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getImage = async (req, res) => {
  const image = req.params.imageId

  try {
    const images = await Image.findImage(image)

    res.status(200).send(images)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteImage = async (req, res) => {
  const image = req.params.imageId

  try {
    const images = await Image.deleteImage(image)

    res.status(200).send(images)
  } catch (err) {
    res.status(400).send(err)
  }
}

const storeImages = async (req, res) => {
  const images = req.body

  const promises = images.map(async (images) => {
    const image = await Image.storeImage(images)
    return image
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
