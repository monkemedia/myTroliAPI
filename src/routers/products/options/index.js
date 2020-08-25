const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductOption,
  getProductOptions,
  getProductOption,
  updateProductOption,
  deleteProductOption
} = require('../../../controller/products/options/index.js')

// Create variant option
router.post('/:storeHash/products/:productId/options', auth, (req, res) => createProductOption(req, res))
// Get variant options
router.get('/:storeHash/products/:productId/options', auth, (req, res) => getProductOptions(req, res))
// Get variant option
router.get('/:storeHash/products/:productId/options/:optionId', auth, (req, res) => getProductOption(req, res))
// Update variant option
router.put('/:storeHash/products/:productId/options/:optionId', auth, (req, res) => updateProductOption(req, res))
// Delete variant option
router.delete('/:storeHash/products/:productId/options/:optionId', auth, (req, res) => deleteProductOption(req, res))

module.exports = router
