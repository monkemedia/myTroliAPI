const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controller/categories')

// Create category
router.post('/:storeHash/categories', auth, (req, res) => createCategory(req, res))
// Get categories
router.get('/:storeHash/categories', auth, (req, res) => getCategories(req, res))
// Get category
router.get('/:storeHash/categories/:categoryId', auth, (req, res) => getCategory(req, res))
// Update category
router.put('/:storeHash/categories/:categoryId', auth, (req, res) => updateCategory(req, res))
// Delete category
router.delete('/:storeHash/categories/:categoryId', auth, (req, res) => deleteCategory(req, res))

module.exports = router
