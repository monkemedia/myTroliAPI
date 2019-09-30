const express = require('express')
const Category = require('../models/Category')
const auth = require('../middleware/auth')
const router = express.Router()

// Create a new Category
router.post('/categories', auth, async (req, res) => {
  const { type, name, slug, status } = req.body

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'category') {
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
    const categories = new Category(req.body)

    await categories.save()

    res.status(201).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get all categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Category.findAllCategories()

    res.status(200).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Get category
router.get('/categories/:categoryId', auth, async (req, res) => {
  const category = await Category.findOne({ _id: req.params.categoryId })

  res.status(200).send(category)
})

// Update category
router.put('/categories/:categoryId', auth, async (req, res) => {
  const _id = req.params.categoryId
  const currentCategoryDetails = await Category.findOne({ _id })
  const { type, name, slug, description, status } = req.body

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'category') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (status && (status !== 'draft' && status !== 'live')) {
    return res.status(401).send({
      message: 'Correct Status is required'
    })
  }

  const data = {
    type,
    _id,
    name: name || currentCategoryDetails.name,
    slug: slug || currentCategoryDetails.slug,
    description: description || currentCategoryDetails.description,
    status: status || currentCategoryDetails.status
  }

  try {
    await Category.updateCategory(data)

    res.status(200).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Delete category
router.delete('/categories/:categoryId', auth, async (req, res) => {
  try {
    await Category.deleteCategory(req.params.categoryId)

    res.status(200).send({
      message: 'Category successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
