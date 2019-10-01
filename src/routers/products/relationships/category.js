const express = require('express')
const CategoryRelationship = require('../../../models/product/relationships/Category')
const auth = require('../../../middleware/auth')
const router = express.Router()

// Create a new Category Relationship
router.post('/products/:productId/relationships/categories', auth, async (req, res) => {
  const data = req.body.data

  if (!data.some(n => n.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(n => n.type !== 'category')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!data.some(n => n.category_id)) {
    return res.status(401).send({
      message: 'Category ID is required'
    })
  }

  try {
    const categories = new CategoryRelationship(req.body)

    await categories.save()

    res.status(201).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
