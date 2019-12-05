const express = require('express')
const Image = require('../../models/uploadcare/Image')
const auth = require('../../middleware/auth')
const router = express.Router()

// Upload new image
router.post('/', async (req, res) => {
  console.log('HERE')
  await Image.upload()
  try {
    // Check to see if customer already exists
    const data = req.body.data
    const { type, file, public } = data

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

    if (public) {
      return res.status(401).send({
        message: 'Public is required'
      })
    }


    await Image.upload()

    console.log('IMAGE RESPONSE', image)

    const { _id } = customer

    res.status(201).send({
      data: {
        type,
        _id,
        name,
        email,
        password: !!password
      }
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
