const ProductCategory = require('../../../models/product/category')
const Product = require('../../../models/product')

const createProductCategory = async (req, res) => {
  const data = req.body.data
  const product_id = req.params.productId
  const { type, category_id } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'category') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!category_id) {
    return res.status(401).send({
      message: 'Category ID is required'
    })
  }

  try {
    const productCategories = new ProductCategory({
      ...data,
      product_id
    })
    const savedProductCategory = await productCategories.save()
    const product = await Product.findById(product_id)
    product.categories.push(savedProductCategory._id)
    product.updated_at = new Date()
    product.save()
    res.status(201).send(savedProductCategory)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteProductCategory = async (req, res) => {
  const productId = req.params.productId

  try {
    const product = await Product.findById(productId)
    const categoryId = product.relationships.categories
    await ProductCategory.deleteCategory(categoryId)

    product.relationships.categories = null
    product.updated_at = new Date()
    product.save()

    res.status(200).send({
      message: 'Category relationship successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateProductCategory = async (req, res) => {
  const data = req.body.data

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'category')) {
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
    const relationshipId = product.relationships.categories

    await ProductCategory.updateCategory({ _id: relationshipId, data })

    product.updated_at = new Date()
    product.save()

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createProductCategory,
  deleteProductCategory,
  updateProductCategory
}
