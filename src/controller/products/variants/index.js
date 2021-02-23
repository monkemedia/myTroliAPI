const ProductVariant = require('../../../models/product/variant/index.js')
const ProductOption = require('../../../models/product/option/index.js')
const Product = require('../../../models/product')

const createProductVariant = async (req, res) => {
  const data = req.body
  const {
    type,
    sku,
    option_values
  } = data
  const productId = req.params.productId
  const store_hash = req.params.storeHash

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!sku) {
    return res.status(401).send({
      message: 'SKU is required'
    })
  }

  if (!option_values) {
    return res.status(401).send({
      message: 'Option values is required'
    })
  }

  try {
    const product = {
      ...data,
      product_id: productId
    }

    const updateOptionValues = await product.option_values.map(async option => {
      const id = option.id
      const optionId = option.option_id
      const productOption = await ProductOption.findProductOption(productId, id)
      const label = await productOption.option_values.filter(val => {
        return JSON.stringify(val._id) === JSON.stringify(optionId)
      })[0].label

      return {
        label,
        option_display_name: productOption.display_name,
        option_id: optionId,
        id
      }
    })

    const results = await Promise.all(updateOptionValues)

    product.option_values = results
    product.store_hash = store_hash

    const savedProductOption = new ProductVariant(product)

    await savedProductOption.save()

    const actualProduct = await Product.findById(productId)

    actualProduct.variants.push(savedProductOption)

    await actualProduct.save()

    res.status(201).send(savedProductOption)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariants = async (req, res) => {
  try {
    const productId = req.params.productId
    const productVariants = await ProductVariant.findProductVariants(productId)

    res.status(200).send(productVariants)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductVariant = async (req, res) => {
  const variantId = req.params.variantId
  const productId = req.params.productId
  const productVariant = await ProductVariant
    .findOne({ _id: variantId, product_id: productId })
    .populate('images')

  res.status(200).send(productVariant)
}

const updateProductVariant = async (req, res) => {
  const data = req.body
  const { type } = data
  const productId = req.params.productId
  const variantId = req.params.variantId

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-variant') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    const product = {
      ...data,
      product_id: productId
    }

    const updateOptionValues = await product.option_values.map(async option => {
      const id = option.id
      const optionId = option.option_id
      const productOption = await ProductOption.findProductOption(productId, id)
      const label = productOption.option_values.filter(val => {
        return JSON.stringify(val._id) === JSON.stringify(optionId)
      })[0].label

      return {
        label,
        option_display_name: productOption.display_name,
        option_id: optionId,
        id
      }
    })

    const results = await Promise.all(updateOptionValues)

    product.option_values = results

    await ProductVariant.updateProductVariant(variantId, product)
    const productVariant = await ProductVariant
      .findOne({ _id: variantId, product_id: productId })
      .populate('images')

    res.status(200).send(productVariant)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductVariant = async (req, res) => {
  try {
    const variantId = req.params.variantId
    const productId = req.params.productId

    await ProductVariant.deleteProductVariant(variantId)

    const actualProduct = await Product.findById(productId)

    actualProduct.variants.pull(variantId)

    await actualProduct.save()

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
