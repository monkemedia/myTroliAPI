const Category = require('../models/category')

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
      message: 'Correct type is required'
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
    const categories = new Category()(data)

    await categories.save()

    res.status(201).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCategories = async (req, res) => {
  const query = req.query
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 20
  const keyword = query && query.keyword
  let categories

  try {
    if (keyword) {
      categories = await Category().search({ page, limit, keyword })
    } else {
      categories = await Category().findCategories({ page, limit })
    }

    res.status(200).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCategory = async (req, res) => {
  const categoryId = req.params.categoryId
  let category
  if (categoryId === 'count') {
    category = await Category().getCount()
  } else {
    category = await Category().findOne({ _id: categoryId })
  }

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
      message: 'Correct type is required'
    })
  }

  try {
    await Category().updateCategory(categoryId, data)
    const category = await Category().findOne({ _id: categoryId })

    res.status(200).send(category)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCategory = async (req, res) => {
  try {
    await Category().deleteCategory(req.params.categoryId)

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
