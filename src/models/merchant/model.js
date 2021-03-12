const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const MerchantSchema = require('./schema')

// Hash the password before saving the Merchant model
MerchantSchema.pre('save', async function (next) {
  const merchant = this
  if (merchant.isModified('password')) {
    merchant.password = await bcrypt.hash(merchant.password, 8)
  }
  next()
})

// Generate token
MerchantSchema.methods.generateToken = async function (expiresIn) {
  const merchant = this
  const accessToken = jwt.sign({
    merchant_id: merchant._id
  }, process.env.API_SECRET, { expiresIn: expiresIn || '24hrs' })

  return accessToken
}

// Search for a merchant by email address
MerchantSchema.statics.findByEmailAddress = async (email) => {
  const merchant = await Merchant.findOne({ email })

  return merchant
}

// Search for a merchant by refresh token
MerchantSchema.statics.findByRefreshToken = async (refresh_token) => {
  const merchant = await Merchant.findOne({ refresh_token })

  return merchant
}

// Search for a merchant by reset token
MerchantSchema.statics.findByResetToken = async (reset_token) => {
  const merchant = await Merchant.findOne({ reset_token })

  return merchant
}

// Update merchant
MerchantSchema.statics.updateMerchant = async (merchantId, data) => {
  const merchant = await Merchant.updateOne({ _id: merchantId }, data)
  return merchant
}

// Update password
MerchantSchema.statics.updateMerchantWithPassword = async (merchantId, password) => {
  const hashedPassword = await bcrypt.hash(password, 8)

  const merchant = await Merchant.updateOne({ _id: merchantId }, { password: hashedPassword, refresh_token: null, reset_token: null })
  return merchant
}

// Delete merchant by id
MerchantSchema.statics.deleteMerchant = async (_id) => {
  const merchant = await Merchant.deleteOne({ _id })
  return merchant
}

const Merchant = mongoose.model('Merchant', MerchantSchema)

module.exports = Merchant
