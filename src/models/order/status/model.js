const mongoose = require('mongoose')
const OrderStatusSchema = require('./schema')

// Get order statuses
OrderStatusSchema.statics.findOrderStatuses = async () => {
  const orderStatuses = await OrderStatus.find({})

  return orderStatuses
}

const OrderStatus = mongoose.model('OrderStatus', OrderStatusSchema)

module.exports = OrderStatus
