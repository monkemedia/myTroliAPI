const mongoose = require('mongoose')
// const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')

const clientSchema = mongoose.Schema({
  grant_type: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// Hash the password before saving the Client model
clientSchema.pre('save', async function (next) {
  const client = this

  if (client.isModified('password')) {
    client.password = await bcrypt.hash(client.password, 8)
  }
  next()
})

// GenErate an access token
clientSchema.methods.generateAccessToken = async function () {
  const client = this
  const accessToken = jwt.sign({
    client_id: client._id,
    grant_type: client.grant_type
  }, process.env.CLIENT_SECRET, { expiresIn: '1h' })

  return accessToken
}

// Search for a client by email address
clientSchema.statics.findByEmail = async (email) => {
  const client = await Client.findOne({ email })

  return client
}

// Search for a Client user by email and password
clientSchema.statics.findByCredentials = async (email, password) => {
  const client = await Client.findOne({ email })

  if (!client) {
    throw errorHandler(422, 'Client does\'t exists')
  }

  const isPasswordMatch = await bcrypt.compare(password, client.password)

  if (!isPasswordMatch) {
    throw errorHandler(422, 'Invalid login credentials')
  }

  return client
}

// Update client
clientSchema.statics.updateClient = async (clientDetails) => {
  const { _id, name, email } = clientDetails
  let { password } = clientDetails

  password = await bcrypt.hash(password, 8)
  const client = await Client.updateOne({ _id }, { name, email, password })
  return client
}

// Delete client by id
clientSchema.statics.deleteClient = async (_id) => {
  const client = await Client.deleteOne({ _id })
  return client
}

const Client = mongoose.model('Client', clientSchema)

module.exports = Client
