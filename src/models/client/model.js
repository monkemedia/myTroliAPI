const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const clientSchema = require('./schema')

// Hash the password before saving the Client model
clientSchema.pre('save', async function (next) {
  const client = this

  if (client.isModified('password')) {
    client.password = await bcrypt.hash(client.password, 8)
  }
  next()
})

// Generate token
clientSchema.methods.generateToken = async function (expiresIn) {
  const client = this
  const accessToken = jwt.sign({
    client_id: client._id,
    type: client.type
  }, process.env.API_SECRET, { expiresIn: expiresIn || '24hrs' })

  return accessToken
}

// Search for a client by email address
clientSchema.statics.findByEmailAddress = async (email) => {
  const client = await Client.findOne({ email })

  return client
}

// Search for a client by refresh token
clientSchema.statics.findByRefreshToken = async (refresh_token) => {
  const client = await Client.findOne({ refresh_token })

  return client
}

// Search for a client by reset token
clientSchema.statics.findByResetToken = async (reset_token) => {
  const client = await Client.findOne({ reset_token })

  return client
}

// Update client
clientSchema.statics.updateClient = async (clientId, data) => {
  const client = await Client.updateOne({ _id: clientId }, data)
  return client
}

// Update password
clientSchema.statics.updateClientWithPassword = async (clientId, password) => {
  const hashedPassword = await bcrypt.hash(password, 8)

  const client = await Client.updateOne({ _id: clientId }, { password: hashedPassword, refresh_token: null, reset_token: null })
  return client
}

// Delete client by id
clientSchema.statics.deleteClient = async (_id) => {
  const client = await Client.deleteOne({ _id })
  return client
}

const Client = mongoose.model('Client', clientSchema)

module.exports = Client
