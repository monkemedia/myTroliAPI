const express = require('express')
// const CategoryRelationship = require('../../../models/product/relationships/Category')
const auth = require('../../../middleware/auth')
const router = express.Router()

// Create a new Category Relationship
router.post('/products/:productId/relationships/categories', auth, async (req, res) => {
  console.log('HELLO', req.body)

  // if (!type) {
  //   return res.status(401).send({
  //     message: 'Type is required'
  //   })
  // }

  // if (type && type !== 'category') {
  //   return res.status(401).send({
  //     message: 'Correct Type is required'
  //   })
  // }

  // if (!name) {
  //   return res.status(401).send({
  //     message: 'Name is required'
  //   })
  // }

  // if (!slug) {
  //   return res.status(401).send({
  //     message: 'Slug is required'
  //   })
  // }

  // if (status && (status !== 'draft' && status !== 'live')) {
  //   return res.status(401).send({
  //     message: 'Correct Status is required'
  //   })
  // }

  // try {
  //   const categories = new CategoryRelationship(req.body)

  //   await categories.save()

  //   res.status(201).send(categories)
  // } catch (err) {
  //   res.status(400).send(err)
  // }
})

module.exports = router
