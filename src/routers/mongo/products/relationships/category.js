const express = require('express')
const Product = require('../../../../models/mongo/product/Product')
const CategoryRelationship = require('../../../../models/mongo/product/relationships/Category')
const auth = require('../../../../middleware/auth')
const router = express.Router()

// Create a new Category Relationship
router.post('/products/:productId/relationships/categories', auth, async (req, res) => {
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
    const categories = new CategoryRelationship(data)
    const savedCategoryRelationship = await categories.save()
    const product = await Product.findById(_id)

    product.relationships.categories.push(savedCategoryRelationship)
    product.save()
    res.status(201).send(savedCategoryRelationship)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Delete Category Relationship
router.delete('/products/:productId/relationships/categories', auth, async (req, res) => {
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
})

module.exports = router
