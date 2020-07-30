const mongoose = require('mongoose')
const orderRefundSchema = require('./schema')
const Product = require('../../product/index.js')
const Order = require('../../order/index.js')

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

orderRefundSchema.pre('save', async function (next) {
  const orderRefund = this
  const refundId = orderRefund._id
  const orderId = orderRefund.order_id
  const items = orderRefund.items
  const totalAmountToRefund = getTotalAmount(items)

  await updateProductsTotalSold(items)
  await updateOrder(orderId, refundId)

  orderRefund.total_amount = totalAmountToRefund

  next()
})

// Get refunds for order
orderRefundSchema.statics.findOrderRefunds = async (orderId) => {
  const orderStatuses = await OrderRefund.find({ order_id: orderId })

  return orderStatuses
}

const OrderRefund = mongoose.model('OrderRefund', orderRefundSchema)

module.exports = OrderRefund
