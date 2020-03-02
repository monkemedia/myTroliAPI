const express = require('express')
const router = express.Router()
const auth = require('../../../../middleware/auth')
const { createProductVariantOption, getProductVariantOptions, getProductVariantOption, updateProductVariantOption, deleteProductVariantOption } = require('../../../../controller/products/variants/options/index.js')

// Create a new variant option
router.post('/products/:productId/options', auth, (req, res) => createProductVariantOption(req, res))
// Get all variant options
router.get('/products/:productId/options', auth, (req, res) => getProductVariantOptions(req, res))
// Get variant option
router.get('/products/:productId/options/:optionId', auth, (req, res) => getProductVariantOption(req, res))
// Update variant option
router.put('/products/:productId/options/:optionId', auth, (req, res) => updateProductVariantOption(req, res))
// Delete variant option
router.delete('/products/:productId/options/:optionId', auth, (req, res) => deleteProductVariantOption(req, res))

module.exports = router
