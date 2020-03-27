const ProductCategories = require('../../../models/product/category')
const Product = require('../../../models/product')

const createProductCategories = async (req, res) => {
  const data = req.body
  const productId = req.params.productId

  // Lets see if product categories already exists
  const productCategories = await ProductCategories.findAllProductCategories(productId)

  if (productCategories && productCategories.length > 0) {
    return res.status(401).send({
      message: 'There is already a Product Category'
    })
  }

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'product-category')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  const payload = {
    product_id: productId,
    categories: data
  }

  try {
    const productCategories = new ProductCategories(payload)
    const savedProductCategories = await productCategories.save()

    res.status(201).send(savedProductCategories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductCategories = async (req, res) => {
  try {
    const productId = req.params.productId
    const productCategories = await ProductCategories.findAllProductCategories(productId)

    res.status(200).send(productCategories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateProductCategories = async (req, res) => {
  const data = req.body
  const productId = req.params.productId

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'product-category')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  const payload = {
    product_id: productId,
    categories: data
  }

  try {
    await ProductCategories.updateProductCategory(productId, payload)

    res.status(200).send(payload)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductCategories = async (req, res) => {
  const productId = req.params.productId

  try {
    await ProductCategories.deleteProductCategory(productId)

    res.status(200).send({
      message: 'Product category successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductCategories,
  getProductCategories,
  deleteProductCategories,
  updateProductCategories
}
