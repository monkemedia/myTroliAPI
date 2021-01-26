const Category = require('../models/category')

const createCategory = async (req, res) => {
  const data = req.body
  const { type, name, slug, status } = data
  const store_hash = req.params.storeHash

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
    const categories = new Category({
      ...data,
      store_hash
    })

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
  const store_hash = req.params.storeHash
  let categories

  try {
    if (keyword) {
      categories = await Category.search({ page, limit, keyword, store_hash })
    } else {
      categories = await Category.findCategories({ page, limit, store_hash })
    }

    res.status(200).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCategory = async (req, res) => {
  const categoryId = req.params.categoryId
  const store_hash = req.params.storeHash
  let category
  if (categoryId === 'count') {
    category = await Category.getCount(store_hash)
  } else {
    category = await Category.findOne({ _id: categoryId })
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
    await Category.updateCategory(categoryId, data)
    const category = await Category.findOne({ _id: categoryId })

    res.status(200).send(category)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCategory = async (req, res) => {
  try {
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
