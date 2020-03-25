const ProductVariant = require('../../../models/product/variant/index.js')
const ProductOption = require('../../../models/product/option/index.js')

const createProductVariant = async (req, res) => {
  const data = req.body
  const {
    type,
    sku,
    option_values
  } = data
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
      product_id
    }

    const updateOptionValues = product.option_values.map(async option => {
      const id = option.id
      const optionId = option.option_id
      const productOption = await ProductOption.findById(id)

      return {
        label: productOption.option_values.filter(val => {
          return JSON.stringify(val._id) === JSON.stringify(optionId)
        })[0].label,
        option_display_name: productOption.display_name,
        option_id: optionId,
        id
      }
    })

    const results = await Promise.all(updateOptionValues)

    product.option_values = results

    const savedProductOption = new ProductVariant(product)

    await savedProductOption.save()

    res.status(201).send(savedProductOption)
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
  const productVariant = await ProductVariant.findOne({ _id, product_id }) // .populate('name', 'value')

  res.status(200).send(productVariant)
}

const updateProductVariant = async (req, res) => {
  const data = req.body
  const { type } = data
  const product_id = req.params.productId
  const variantId = req.params.variantId

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

  try {
    const product = {
      ...data,
      product_id
    }

    const updateOptionValues = product.option_values.map(async option => {
      const id = option.id
      const optionId = option.option_id
      const productOption = await ProductOption.findById(id)

      return {
        label: productOption.option_values.filter(val => {
          return JSON.stringify(val._id) === JSON.stringify(optionId)
        })[0].label,
        option_display_name: productOption.display_name,
        option_id: optionId,
        id
      }
    })

    const results = await Promise.all(updateOptionValues)

    product.option_values = results

    await ProductVariant.updateProductVariant(variantId, product)

    res.status(200).send(product)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductVariant = async (req, res) => {
  try {
    const variantId = req.params.variantId

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
