const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductCustomField,
  getProductCustomFields,
  getProductCustomField,
  updateProductCustomField,
  deleteProductCustomField
} = require('../../../controller/products/customFields/index.js')

// Create product custom field
router.post('/products/:productId/custom-fields', auth, (req, res) => createProductCustomField(req, res))
// Get product custom fields
router.get('/products/:productId/custom-fields', auth, (req, res) => getProductCustomFields(req, res))
// Get product custom field
router.get('/products/:productId/custom-fields/:customFieldId', auth, (req, res) => getProductCustomField(req, res))
// Update product custom field
router.put('/products/:productId/custom-fields/:customFieldId', auth, (req, res) => updateProductCustomField(req, res))
// Delete product custom field
router.delete('/products/:productId/custom-fields/:customFieldId', auth, (req, res) => deleteProductCustomField(req, res))

module.exports = router
