// const image = require('../models/image')

const uploadImage = async (req, res) => {
  console.log('monkey')
  try {
    // Check to see if customer already exists
    const data = req.body.data
    const { type, file, isPublic } = data

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

    if (isPublic) {
      return res.status(401).send({
        message: 'Public is required'
      })
    }

    // await Image.upload()

    // console.log('IMAGE RESPONSE', image)

    // const { _id } = customer

    // res.status(201).send({
    //   data: {
    //     type,
    //     _id,
    //     name,
    //     email,
    //     password: !!password
    //   }
    // })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  uploadImage
}
