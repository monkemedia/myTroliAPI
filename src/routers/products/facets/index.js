const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductFacet,
  getProductFacets,
  getProductFacet,
  updateProductFacet,
  deleteProductFacet
} = require('../../../controller/products/facets/index.js')

// Create product facet
router.post('/products/:productId/facets', auth, (req, res) => createProductFacet(req, res))
// Get product facets
router.get('/products/:productId/facets', auth, (req, res) => getProductFacets(req, res))
// Get product facet
router.get('/products/:productId/facets/:facetId', auth, (req, res) => getProductFacet(req, res))
// Update product facet
router.put('/products/:productId/facets/:facetId', auth, (req, res) => updateProductFacet(req, res))
// Delete product facet
router.delete('/products/:productId/facets/:facetId', auth, (req, res) => deleteProductFacet(req, res))

module.exports = router
