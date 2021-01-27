const ProductVariantImage = require('../../../../models/product/variant/images')
const ProductVariant = require('../../../../models/product/variant')
const Image = require('../../../../models/image')

const createProductVariantImage = async (req, res) => {
  const data = req.body
  const productId = req.params.productId
  const variantId = req.params.variantId
  const storeHash = req.params.storeHash

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'product-variant-image')) {
    return res.status(401).send({
      message: 'Correct type is required'
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
      obj.variant_id = variantId
      obj.store_hash = storeHash
      const images = new ProductVariantImage(obj)
      const save = await images.save()
      return save
    })
    const savedProductVariantImage = await Promise.all(promise)

    const productVariant = await ProductVariant.findOne({ _id: variantId, product_id: productId })

    savedProductVariantImage.map(spi => {
      productVariant.images.push(spi)
    })

    await productVariant.save()

    res.status(201).send(savedProductVariantImage)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariantImages = async (req, res) => {
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
    const variantId = req.params.variantId
    let productVariantImages

    if (query) {
      productVariantImages = await ProductVariantImage.findProductVariantImagesByQuery(productId, variantId, queryObj)
    } else {
      productVariantImages = await ProductVariantImage.findAllProductVariantImages(productId, variantId)
    }
    res.status(200).send(productVariantImages)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariantImage = async (req, res) => {
  const productId = req.params.productId
  const variantId = req.params.variantId
  const imageId = req.params.imageId

  const productVariantImage = await ProductVariantImage.findProductVariantImage(productId, variantId, imageId)

  res.status(200).send(productVariantImage)
}

const updateProductVariantImage = async (req, res) => {
  const data = req.body
  const { type } = data
  const productId = req.params.productId
  const variantId = req.params.variantId
  const imageId = data._id

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant-image') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await ProductVariantImage.updateProductVariantImage(productId, variantId, data)
    const productVariantImage = await ProductVariantImage.findProductVariantImage(productId, variantId, imageId)

    res.status(200).send(productVariantImage)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductVariantImage = async (req, res) => {
  const data = req.body
  const { type } = data
  const productId = req.params.productId
  const variantId = req.params.variantId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'product-variant-image') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await ProductVariantImage.deleteImage(data._id)
    const productVariant = await ProductVariant.findOne({ _id: variantId, product_id: productId })

    if (productVariant) {
      await Image.deleteImage(data.image_id, storeHash)
      await productVariant.images.pull(data._id)
      productVariant.save()
    }

    res.status(200).send({
      message: 'Product variant image successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductVariantImage,
  getProductVariantImages,
  getProductVariantImage,
  updateProductVariantImage,
  deleteProductVariantImage
}
