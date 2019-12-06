const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { createClient, getClient, updateClient, deleteClient } = require('../controller/client')

// Create client
router.post('/client', (req, res) => createClient(req, res))
// Get client
router.get('/client/:clientId', auth, (req, res) => getClient(req, res))
// Update client
router.put('/client/:clientId', auth, (req, res) => updateClient(req, res))
// Delete client
router.delete('/clients/:clientId', auth, (req, res) => deleteClient(req, res))

module.exports = router
