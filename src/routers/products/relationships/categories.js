const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { createCategoryRelationship, updateCategoryRelationship, deleteCategoryRelationship } = require('../../../controller/products/relationships/category')

// Create a new Category Relationship
router.post('/products/:productId/relationships/categories', auth, (req, res) => createCategoryRelationship(req, res))
// Update a Category Relationship
router.put('/products/:productId/relationships/categories', auth, (req, res) => updateCategoryRelationship(req, res))
// Delete Category Relationship
router.delete('/products/:productId/relationships/categories', auth, (req, res) => deleteCategoryRelationship(req, res))

module.exports = router
