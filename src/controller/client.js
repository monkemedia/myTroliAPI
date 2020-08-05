const Client = require('../models/client')
const emailTemplate = require('../utils/emailTemplate')

const createClient = async (req, res) => {
  const data = req.body
  const { email, name, role, type } = data
  const clientExists = await Client.findByEmailAddress(email)

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'client_credentials') {
    return res.status(401).send({
      message: 'Correct type is required'
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

  if (!role) {
    return res.status(401).send({
      message: 'Role is required'
    })
  }

  if (clientExists) {
    return res.status(401).send({
      message: 'Client already exists'
    })
  }

  try {
    const client = new Client(data)
    const activateToken = await client.generateToken('1hr')

    client.reset_token = activateToken
    await client.save()

    emailTemplate.activateAccount({
      email,
      name,
      activateToken
    })
    await client.save()

    const clientCopy = Object.assign(data, {
      password: false
    })

    res.status(201).send(clientCopy)
  } catch (err) {
    res.status(err.status).send(err)
  }
}

const getClients = async (req, res) => {
  const client = await Client
    .aggregate()
    .project({
      name: 1,
      email: 1,
      enabled: 1,
      role: 1,
      password: { $toBool: '$password' }
    })

  res.status(200).send(client)
}

const getClient = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateClient = async (req, res) => {
  const clientId = req.params.clientId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'client_credentials') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    if (data.password) {
      await Client.updateClientWithPassword(clientId, data)
    } else {
      await Client.updateClient(clientId, data)
    }
    const client = await Client.findOne({ _id: clientId })
      .select('-reset_token -refresh_token')

    const clientClone = Object.assign(client, {
      password: !!client.password
    })

    res.status(200).send(clientClone)
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

const resendActivationEmail = async (req, res) => {
  try {
    const data = req.body
    const { type, name, email } = data

    if (!type) {
      return res.status(401).send({
        message: 'Type is required'
      })
    }

    if (type !== 'client_credentials') {
      return res.status(401).send({
        message: 'Correct type is required'
      })
    }

    const client = await Client.findOne({ _id: req.params.clientId }).select('-password')
    const activateToken = await client.generateToken('1hr')

    client.reset_token = activateToken
    await client.save()
    emailTemplate.activateAccount({
      email,
      name,
      activateToken
    })
    res.status(200).send({
      message: 'Activation email successfully sent'
    })
  } catch (err) {
    res.status(err.status).send(err)
  }
}

module.exports = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  resendActivationEmail
}
