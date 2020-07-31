const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const paymentRefundSchema = require('./schema')

// Create payment refund
paymentRefundSchema.statics.createPaymentRefund = async (charge, amount) => {
  const paymentRefund = await stripe.refunds.create({ charge, amount })

  return paymentRefund
}

// Get payment refund
paymentRefundSchema.statics.getPaymentRefund = async (id) => {
  const paymentRefund = await stripe.refunds.retrieve(id)
  return paymentRefund
}

const PaymentRefund = mongoose.model('PaymentRefund', paymentRefundSchema)

module.exports = PaymentRefund
