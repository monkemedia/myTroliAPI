const mongoose = require('mongoose')
const orderStatusSchema = require('./schema')

// Get order statuses
orderStatusSchema.statics.findOrderStatuses = async () => {
  const orderStatuses = await OrderStatus.find({})

  return orderStatuses
}

// Update order status
orderStatusSchema.statics.updateOrderStatus = async (statusOrderId, orderStatusDetails) => {
  const orderStatus = await OrderStatus.updateOne({ status_id: statusOrderId }, orderStatusDetails)
  return orderStatus
}

// Delete order status
orderStatusSchema.statics.deleteOrderStatus = async (orderStatusId) => {
  const orderStatus = await OrderStatus.deleteOne({ status_id: orderStatusId })
  return orderStatus
}

const OrderStatus = mongoose.model('OrderStatus', orderStatusSchema)

module.exports = OrderStatus
