const mongoose = require('mongoose')
const orderSchema = require('./schema')
const Product = require('../product/index.js')

async function stockCheckMethod (order) {
  const promise = await order.products.map(async (orderProduct) => {
    const productId = orderProduct.product_id
    const product = await Product.findOne({ _id: productId })

    console.log(orderProduct.quantity)
    console.log(product.stock)

    if (orderProduct.quantity > product.stock) {
      return false
    }

    return true
  })

  return Promise.all(promise)
  // const product = await Product.findOne({ _id: productId })
}

// Check stock before creating order
orderSchema.pre('save', async function (next) {
  const order = this
  const stockCheck = await stockCheckMethod(order)
  const outOfStock = stockCheck.includes(false)
  if (outOfStock) {
    throw new Error('Out of stock')
  }
  next()
})

// Get orders
orderSchema.statics.findOrders = async () => {
  const orders = await Order.find({})

  return orders
}

// Update order
orderSchema.statics.updateOrder = async (orderId, orderDetails) => {
  const order = await Order.updateOne({ _id: orderId }, orderDetails)
  return order
}

// Delete order
orderSchema.statics.deleteOrder = async (orderId) => {
  const order = await Order.deleteOne({ _id: orderId })
  return order
}

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
