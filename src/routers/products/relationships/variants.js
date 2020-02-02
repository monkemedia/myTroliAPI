const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { createVariantRelationship, updateVariantRelationship, deleteVariantRelationship } = require('../../../controller/products/relationships/variant')

// Create a new Variant Relationship
router.post('/products/:productId/relationships/variants', auth, (req, res) => createVariantRelationship(req, res))
// Update a Variant Relationship
router.put('/products/:productId/relationships/variants', auth, (req, res) => updateVariantRelationship(req, res))
// Delete Variant Relationship
router.delete('/products/:productId/relationships/variants', auth, (req, res) => deleteVariantRelationship(req, res))

module.exports = router
