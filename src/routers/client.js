const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  resendActivationEmail
} = require('../controller/client')

// Create client
router.post('/:storeHash/client', (req, res) => createClient(req, res))
// Get clients
router.get('/:storeHash/client', auth, (req, res) => getClients(req, res))
// Get client
router.get('/:storeHash/client/:clientId', auth, (req, res) => getClient(req, res))
// Update client
router.put('/:storeHash/client/:clientId', auth, (req, res) => updateClient(req, res))
// Delete client
router.delete('/:storeHash/client/:clientId', auth, (req, res) => deleteClient(req, res))
// Resend activation email
router.post('/:storeHash/client/resend/:clientId', auth, (req, res) => resendActivationEmail(req, res))

module.exports = router
