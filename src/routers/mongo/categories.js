const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../../controller/categories')

// Create a new Category
router.post('/categories', auth, (req, res) => createCategory(req, res))
// Get all categories
router.get('/categories', auth, (req, res) => getCategories(req, res))
// Get category
router.get('/categories/:categoryId', auth, (req, res) => getCategory(req, res))
// Update category
router.put('/categories/:categoryId', auth, (req, res) => updateCategory(req, res))
// Delete category
router.delete('/categories/:categoryId', auth, (req, res) => deleteCategory(req, res))

module.exports = router
