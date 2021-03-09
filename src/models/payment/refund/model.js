const mongoose = require('mongoose')
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const paymentRefundSchema = require('./schema')

// Create payment refund
paymentRefundSchema.statics.createPaymentRefund = async (stripePaymentIntentId, amount, stripeAccount) => {
  const { charges } = await stripe.paymentIntents.retrieve(stripePaymentIntentId, { stripeAccount })
  const charge = charges.data[0].id

  const paymentRefund = await stripe.refunds.create({ 
    refund_application_fee: false,
    charge,
    amount 
  }, { stripeAccount })

  return paymentRefund
}

// Get payment refund
paymentRefundSchema.statics.getPaymentRefund = async (id) => {
  const paymentRefund = await stripe.refunds.retrieve(id)
  return paymentRefund
}

const PaymentRefund = mongoose.model('PaymentRefund', paymentRefundSchema)

module.exports = PaymentRefund
