const ProductCategories = require('../../../models/product/category')

const createProductCategories = async (req, res) => {
  const data = req.body
  const productId = req.params.productId

  // Lets see if product categories already exists
  const productCategories = await ProductCategories.findProductCategory(productId)

  if (productCategories && productCategories.length > 0) {
    return res.status(401).send({
      message: 'There is already a Product Category'
    })
  }

  if (!data.type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.type !== 'product-category') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  const payload = {
    product_id: productId,
    ...data
  }

  try {
    const productCategories = new ProductCategories(payload)
    const savedProductCategories = await productCategories.save()

    res.status(201).send(savedProductCategories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductCategory = async (req, res) => {
  try {
    const productId = req.params.productId
    const productCategories = await ProductCategories.findProductCategory(productId)

    res.status(200).send(productCategories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateProductCategories = async (req, res) => {
  const data = req.body
  const productId = req.params.productId

  if (!data.type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.type !== 'product-category') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await ProductCategories.updateProductCategory(productId, data)

    res.status(200).send(data)
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
  getProductCategory,
  deleteProductCategories,
  updateProductCategories
}
