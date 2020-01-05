const CategoryRelationship = require('../../../models/product/relationships/category')
const Product = require('../../../models/product')

const createCategoryRelationship = async (req, res) => {
  const data = req.body.data
  const _id = req.params.productId

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
    const categories = new CategoryRelationship({ data })
    const savedCategoryRelationship = await categories.save()
    const product = await Product.findById(_id)

    product.relationships.categories = savedCategoryRelationship._id
    product.save()
    res.status(201).send(savedCategoryRelationship)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCategoryRelationship = async (req, res) => {
  const data = req.body.data
  const _id = req.params.productId
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
    await CategoryRelationship.deleteCategory(category_id)
    const product = await Product.findById(_id)

    product.relationships.categories.pull({ _id: category_id })
    product.save()

    res.status(200).send({
      message: 'Category relationship successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateCategoryRelationship = async (req, res) => {
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

    await CategoryRelationship.updateCategory({ _id: relationshipId, data })

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createCategoryRelationship,
  deleteCategoryRelationship,
  updateCategoryRelationship
}
