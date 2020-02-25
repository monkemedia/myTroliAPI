const ProductCategory = require('../../../models/product/category')
const Product = require('../../../models/product')

const createProductCategory = async (req, res) => {
  const data = req.body.data
  const product_id = req.params.productId
  const { type, name } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'product-category') {
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

const getProductCategories = async (req, res) => {
  try {
    const productId = req.params.productId
    const productCategories = await ProductCategory.findAllProductCategories(productId)

    res.status(200).send({ data: productCategories })
  } catch (err) {
    res.status(400).send(err)
  }
}

const getProductCategory = async (req, res) => {
  const _id = req.params.categoryId
  const product_id = req.params.productId
  const productCategory = await ProductCategory.findOne({ _id, product_id }).populate('name', 'name')

  res.status(200).send({ data: productCategory })
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

module.exports = {
  createProductCategory,
  getProductCategories,
  getProductCategory,
  deleteProductCategory
}
