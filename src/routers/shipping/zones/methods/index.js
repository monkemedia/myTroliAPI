const express = require('express')
const router = express.Router()
const auth = require('../../../../middleware/auth')
const {
  createShippingMethod,
  getShippingMethods,
  getShippingMethod,
  updateShippingMethod,
  deleteShippingMethod
} = require('../../../../controller/shipping/zones/methods')

// Create shipping method
router.post('/:storeHash/shipping/zones/:zoneId/methods', auth, (req, res) => createShippingMethod(req, res))
// Get shipping methods
router.get('/:storeHash/shipping/zones/:zoneId/methods', auth, (req, res) => getShippingMethods(req, res))
// Get shipping method
router.get('/:storeHash/shipping/zones/:zoneId/methods/:methodId', auth, (req, res) => getShippingMethod(req, res))
// Update shipping method
router.put('/:storeHash/shipping/zones/:zoneId/methods/:methodId', auth, (req, res) => updateShippingMethod(req, res))
// Delete shipping method
router.delete('/:storeHash/shipping/zones/:zoneId/methods/:methodId', auth, (req, res) => deleteShippingMethod(req, res))

module.exports = router
