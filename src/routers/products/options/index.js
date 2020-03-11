const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { createProductOption, getProductOptions, getProductOption, updateProductOption, deleteProductOption } = require('../../../controller/products/options/index.js')

// Create a new variant option
router.post('/products/:productId/options', auth, (req, res) => createProductOption(req, res))
// Get all variant options
router.get('/products/:productId/options', auth, (req, res) => getProductOptions(req, res))
// Get variant option
router.get('/products/:productId/options/:optionId', auth, (req, res) => getProductOption(req, res))
// Update variant option
router.put('/products/:productId/options/:optionId', auth, (req, res) => updateProductOption(req, res))
// Delete variant option
router.delete('/products/:productId/options/:optionId', auth, (req, res) => deleteProductOption(req, res))

module.exports = router
