const Category = require('../models/category')
const ProductCategories = require('../models/product/category')

const createCategory = async (req, res) => {
  const data = req.body
  const { type, name, slug, status } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'categories') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!slug) {
    return res.status(401).send({
      message: 'Slug is required'
    })
  }

  if (status && (status !== 'draft' && status !== 'live')) {
    return res.status(401).send({
      message: 'Correct Status is required'
    })
  }

  try {
    const categories = new Category(data)

    await categories.save()

    res.status(201).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findCategories()

    res.status(200).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.params.categoryId })

  res.status(200).send(category)
}

const updateCategory = async (req, res) => {
  const categoryId = req.params.categoryId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'categories') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await Category.updateCategory(categoryId, data)
    const category = await Category.findOne({ _id: categoryId })

    res.status(200).send(category)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCategory = async (req, res) => {
  try {
    // Delete any relationships first
    const relationships = await ProductCategories.findProductCategories(req.params.categoryId)
    relationships.map(async relationship => {
      await ProductCategories.deleteCategory(relationship._id)
    })

    await Category.deleteCategory(req.params.categoryId)

    res.status(200).send({
      message: 'Category successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
}
