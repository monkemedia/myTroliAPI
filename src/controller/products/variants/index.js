const ProductVariant = require('../../../models/product/variant/index.js')
const Product = require('../../../models/product')

const createProductVariant = async (req, res) => {
  const data = req.body.data
  const {
    type,
    name
  } = req.body.data
  const product_id = req.params.productId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  try {
    const productVariant = new ProductVariant({
      ...data,
      product_id
    })

    const savedProductVariant = await productVariant.save()
    const product = await Product.findById(product_id)

    product.variants.push(savedProductVariant._id)
    product.save()

    res.status(201).send(productVariant)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariants = async (req, res) => {
  try {
    const productId = req.params.productId
    const productVariants = await ProductVariant.findAllProductVariants(productId)

    res.status(200).send(productVariants)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariant = async (req, res) => {
  const _id = req.params.variantId
  const product_id = req.params.productId
  const productVariant = await ProductVariant.findOne({ _id, product_id }).populate('name', 'value')

  res.status(200).send(productVariant)
}

const updateProductVariant = async (req, res) => {
  const variantId = req.params.variantId
  const productId = req.params.productId
  const currentProductVariantDetails = await ProductVariant.findOne({ variantId })
  const {
    type,
    name
  } = req.body.data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  const data = {
    type,
    _id: variantId,
    product_id: productId,
    name: name || currentProductVariantDetails.name
  }

  try {
    await ProductVariant.updateProductVariant(data)
    const product = await Product.findById(productId)

    product.updated_at = new Date()
    product.save()

    res.status(200).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductVariant = async (req, res) => {
  try {
    const productId = req.params.productId
    const variantId = req.params.variantId
    const product = await Product.findById(productId)
    // const productVariant = await ProductVariant.findById(variantId)

    // DELETE all related options
    // if (productVariant.options.length > 0) {
    //   productVariant.options.map(async (optionId) => {
    //     await ProductVariantOption.deleteProductVariantOption(optionId)
    //   })
    // }

    await product.variants.pull(variantId)
    await product.save()
    await ProductVariant.deleteProductVariant(variantId)

    res.status(200).send({
      message: 'Product variant successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductVariant,
  getProductVariants,
  getProductVariant,
  updateProductVariant,
  deleteProductVariant
}
