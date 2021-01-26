const mongoose = require('mongoose')
const OrderStatusSchema = require('./schema')

// Get order statuses
OrderStatusSchema.statics.findOrderStatuses = async (store_hash) => {
  const orderStatuses = await OrderStatus.find({ store_hash })

  return orderStatuses
}

const OrderStatus = mongoose.model('OrderStatus', OrderStatusSchema)

module.exports = OrderStatus
