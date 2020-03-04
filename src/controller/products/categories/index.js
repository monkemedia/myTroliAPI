const ProductCategories = require('../../../models/product/category')
const Product = require('../../../models/product')

const createProductCategories = async (req, res) => {
  const data = req.body
  const _id = req.params.productId

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

  try {
    const productCategories = new ProductCategories({ data })
    const savedProductCategories = await productCategories.save()
    const product = await Product.findById(_id)

    product.categories = savedProductCategories._id
    product.updated_at = new Date()
    product.save()
    res.status(201).send(savedProductCategories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductCategories = async (req, res) => {
  const productId = req.params.productId

  try {
    const product = await Product.findById(productId)
    const categoryId = product.categories
    await ProductCategories.deleteCategory(categoryId)

    product.categories = null
    product.updated_at = new Date()
    product.save()

    res.status(200).send({
      message: 'Category relationship successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateProductCategories = async (req, res) => {
  const data = req.body

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

  if (data.some(val => !val.category_id)) {
    return res.status(401).send({
      message: 'Category ID is required'
    })
  }

  try {
    const product_id = req.params.productId
    const product = await Product.findById(product_id)
    const relationshipId = product.categories

    await ProductCategories.updateCategory({ _id: relationshipId, data })

    product.updated_at = new Date()
    product.save()

    res.status(200).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductCategories,
  deleteProductCategories,
  updateProductCategories
}
