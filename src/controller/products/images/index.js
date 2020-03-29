const ProductImage = require('../../../models/product/images')

const createProductImage = async (req, res) => {
  const data = req.body
  const productId = req.params.productId

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'product-image')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (data.some(val => !val.image_id)) {
    return res.status(401).send({
      message: 'Image ID is required'
    })
  }

  if (data.some(val => !val.image_url)) {
    return res.status(401).send({
      message: 'Image URL is required'
    })
  }

  try {
    const promise = data.map(async obj => {
      obj.product_id = productId
      const images = new ProductImage(obj)
      const save = await images.save()
      return save
    })
    const savedProductImage = await Promise.all(promise)

    res.status(201).send(savedProductImage)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductImages = async (req, res) => {
  const query = req.query
  const queryObj = {}

  // Queries with 'true' or 'false' need to be converted into Booleans
  Object.entries(query).forEach(([key, value]) => {
    let val
    if (value === 'true') {
      val = true
    } else if (value === 'false') {
      val = false
    } else {
      val = value
    }
    queryObj[key] = val
  })

  try {
    const productId = req.params.productId
    let productImages

    if (query) {
      productImages = await ProductImage.findProductImagesByQuery(productId, queryObj)
    } else {
      productImages = await ProductImage.findAllProductImages(productId)
    }
    res.status(200).send(productImages)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductImage = async (req, res) => {
  const productId = req.params.productId
  const imageId = req.params.imageId
  const productImage = await ProductImage.findOption(productId, imageId)

  res.status(200).send(productImage)
}

const updateProductImage = async (req, res) => {
  const { type } = req.body
  const productId = req.params.productId
  const imageId = req.params.imageId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-image') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await ProductImage.updateProductImage(productId, imageId, req.body)

    res.status(200).send(req.body)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductImage = async (req, res) => {
  const data = req.body

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'product-image')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const promise = await data.map(async obj => {
      await ProductImage.deleteFile(obj.image_id)
    })

    await Promise.all(promise)

    res.status(200).send({
      message: 'Product image successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductImage,
  getProductImages,
  getProductImage,
  updateProductImage,
  deleteProductImage
}
