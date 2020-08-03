const mongoose = require('mongoose')
const orderRefundSchema = require('./schema')
const Product = require('../../product/index.js')
const Order = require('../index.js')
const Customer = require('../../customer/index.js')
const PaymentRefund = require('../../payment/refund/index.js')

const getTotalAmount = (items) => {
  let sum = 0
  // Calculate total amount to refund
  items.map(item => {
    sum += item.amount
  })
  return sum
}

const updateProductsTotalSold = async (items) => {
  const promise = items.map(async (item) => {
    if (item.item_type === 'product') {
      const productId = item.item_id
      const quantity = item.quantity
      const product = await Product.updateOne({ _id: productId }, {
        $inc: {
          total_sold: -quantity
        }
      })
      return product
    }

    return true
  })

  return Promise.all(promise)
}

const updateOrder = async (orderId, refundId) => {
  await Order.updateOne({ id: orderId }, {
    $push: {
      refunded: refundId
    },
    updated_at: Date.now()
  })
}

const refundMonies = async (payment, customerId, orderRefund) => {
  const paymentProvider = payment.provider
  const chargeId = payment.charge_id

  if (paymentProvider === 'store_credit') {
    await Customer.updateCustomersStoreCredit(customerId, payment.amount)
  } else if (paymentProvider === 'stripe') {
    await PaymentRefund.createPaymentRefund(chargeId, payment.amount)
  }
}

orderRefundSchema.pre('save', async function (next) {
  const orderRefund = this
  const refundId = orderRefund._id
  const orderId = orderRefund.order_id
  const customerId = orderRefund.customer_id
  const items = orderRefund.items
  const payment = orderRefund.payment
  const totalAmountToRefund = getTotalAmount(items)

  try {
    await refundMonies(payment, customerId, orderRefund)
    await updateProductsTotalSold(items)
    await updateOrder(orderId, refundId) // Adds refund ID to Order endpoint

    orderRefund.total_amount = totalAmountToRefund
    next()
  } catch (err) {
    orderRefund.payment.is_declined = true
    orderRefund.payment.declined_message = err.message

    next(err)
  }
})

// Get refunds for order
orderRefundSchema.statics.findOrderRefunds = async (orderId) => {
  const orderRefunds = await OrderRefund.find({ order_id: orderId })

  return orderRefunds
}

const OrderRefund = mongoose.model('OrderRefund', orderRefundSchema)

module.exports = OrderRefund
