const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient
} = require('../controller/client')

// Create client
router.post('/client', (req, res) => createClient(req, res))
// Get clients
router.get('/client', auth, (req, res) => getClients(req, res))
// Get client
router.get('/client/:clientId', auth, (req, res) => getClient(req, res))
// Update client
router.put('/client/:clientId', auth, (req, res) => updateClient(req, res))
// Delete client
router.delete('/client/:clientId', auth, (req, res) => deleteClient(req, res))

module.exports = router
