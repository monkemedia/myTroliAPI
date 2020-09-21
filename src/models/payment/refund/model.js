const mongoose = require('mongoose')
const Stripe = require('stripe')
const Store = require('../../store')
const paymentRefundSchema = require('./schema')

// Create payment refund
paymentRefundSchema.statics.createPaymentRefund = async (charge, amount) => {
  const store = await Store().findOne()
  const paymentRefund = await Stripe(store.stripe_secret_key).refunds.create({ charge, amount })

  return paymentRefund
}

// Get payment refund
paymentRefundSchema.statics.getPaymentRefund = async (id) => {
  const store = await Store().findOne()
  const paymentRefund = await Stripe(store.stripe_secret_key).refunds.retrieve(id)
  return paymentRefund
}

const PaymentRefund = mongoose.model('PaymentRefund', paymentRefundSchema)

module.exports = PaymentRefund
