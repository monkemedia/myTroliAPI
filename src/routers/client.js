const express = require('express')
const Client = require('../models/Client')
const auth = require('../middleware/auth')
const router = express.Router()

// Create client
router.post('/', async (req, res) => {
  const { email, password } = req.body
  const grantType = req.body.grant_type

  if (!grantType) {
    return res.status(401).send({
      message: 'Grant Type is required'
    })
  }

  if (grantType && grantType !== 'client_credentials') {
    return res.status(401).send({
      message: 'Correct Grant Type is required'
    })
  }

  if (!email) {
    return res.status(401).send({
      message: 'Email is required'
    })
  }

  if (!password) {
    return res.status(401).send({
      message: 'Password is required'
    })
  }

  try {
    const client = new Client(req.body)
    await client.save()

    const { _id } = client

    const clientCopy = Object.assign(req.body, {
      password: !!password,
      _id
    })

    res.status(201).send(clientCopy)
  } catch (err) {
    res.status(err.status).send(err)
  }
})

// Get customer
router.get('/client/:clientId', auth, async (req, res) => {
  const client = await Client.findOne({ _id: req.params.clientId })
  const clientClone = Object.assign(client, {
    password: !!client.password
  })

  res.status(200).send(clientClone)
})

// Update customer
router.put('/client/:clientId', auth, async (req, res) => {
  const _id = req.params.clientId
  const currentClientDetails = await Client.findOne({ _id: req.params.clientId })
  const { type, name, email, password } = req.body

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'client') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  const data = {
    type,
    _id,
    name: name || currentClientDetails.name,
    email: email || currentClientDetails.email,
    password: password || currentClientDetails.password
  }

  try {
    await Client.updateClient(data)

    res.status(201).send(data)
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
