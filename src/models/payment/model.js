const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const paymentSchema = require('./schema')

// Create payment
paymentSchema.statics.createPayment = async ({ source, receipt_email, currency, amount }) => {
  const payment = await stripe.charges.create({
    source,
    receipt_email,
    currency,
    amount
  })
  return payment
}

// Get payment
paymentSchema.statics.getPayment = async (id) => {
  const payment = await stripe.charges.retrieve(id)
  return payment
}

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
