const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { createFileRelationship, deleteFileRelationship } = require('../../../controller/products/relationships/file')

// Create a new Category Relationship
router.post('/products/:productId/relationships/files', auth, (req, res) => createFileRelationship(req, res))
// Delete Category Relationship
router.delete('/products/:productId/relationships/files', auth, (req, res) => deleteFileRelationship(req, res))

module.exports = router
