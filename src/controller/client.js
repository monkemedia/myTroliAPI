const Client = require('../models/client')

const createClient = async (req, res) => {
  const data = req.body
  const { email, name, password, grant_type } = data
  const clientExists = await Client.findByEmail(email)

  if (!grant_type) {
    return res.status(401).send({
      message: 'Grant Type is required'
    })
  }

  if (grant_type && grant_type !== 'client_credentials') {
    return res.status(401).send({
      message: 'Correct Grant Type is required'
    })
  }

  if (!email) {
    return res.status(401).send({
      message: 'Email is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!password) {
    return res.status(401).send({
      message: 'Password is required'
    })
  }

  if (clientExists) {
    return res.status(401).send({
      message: 'Client already exists'
    })
  }

  try {
    const client = new Client(data)
    await client.save()

    const { _id } = client

    const clientCopy = Object.assign(data, {
      password: !!password,
      _id
    })

    res.status(201).send(clientCopy)
  } catch (err) {
    res.status(err.status).send(err)
  }
}

const getClient = async (req, res) => {
  const client = await Client.findOne({ _id: req.params.clientId }).select('-reset_token -refresh_token')

  if (!client) {
    return res.status(401).send({
      message: 'Client does not exist'
    })
  }
  const clientClone = Object.assign(client, {
    password: !!client.password
  })

  res.status(200).send(clientClone)
}

const updateClient = async (req, res) => {
  const _id = req.params.clientId
  const currentClientDetails = await Client.findOne({ _id: req.params.clientId })
  const { type, email, name, password } = req.body

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
    email: email || currentClientDetails.email,
    name: name || currentClientDetails.name,
    password: password || currentClientDetails.password
  }

  try {
    await Client.updateClient(data)

    res.status(200).send({
      data: {
        type: data.type,
        _id: data._id,
        email: data.email,
        name: data.name,
        password: `${!!data.password}`
      }
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteClient = async (req, res) => {
  try {
    await Client.deleteClient(req.params.clientId)

    res.status(200).send({
      message: 'Client successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createClient,
  getClient,
  updateClient,
  deleteClient
}
