const mongoose = require('mongoose')
const OrderStatusSchema = require('./schema')

// Get order statuses
OrderStatusSchema.statics.findOrderStatuses = async () => {
  const orderStatuses = await OrderStatus.find({})

  return orderStatuses
}

// Update order status
OrderStatusSchema.statics.updateOrderStatus = async (statusOrderId, orderStatusDetails) => {
  const orderStatus = await OrderStatus.updateOne({ status_id: statusOrderId }, {
    ...orderStatusDetails,
    updated_at: Date.now()
  })
  return orderStatus
}

// Delete order status
OrderStatusSchema.statics.deleteOrderStatus = async (orderStatusId) => {
  const orderStatus = await OrderStatus.deleteOne({ status_id: orderStatusId })
  return orderStatus
}

const OrderStatus = mongoose.model('OrderStatus', OrderStatusSchema)

module.exports = OrderStatus
