const mongoose = require('mongoose')
const orderSchema = require('./schema')
const Product = require('../product/index.js')
const AutoIncrement = require('mongoose-sequence')(mongoose)

orderSchema.plugin(AutoIncrement, {
  inc_field: 'id',
  start_seq: 100
})

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
orderSchema.statics.findOrders = async ({ page, limit }) => {
  const orders = await Order
    .find({})
    .sort('-date_created')
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Order.countDocuments()
  return {
    data: orders,
    meta: {
      pagination: {
        current: page,
        total: orders.length
      },
      results: {
        total
      }
    }
  }
}

// Search orders by Name or SKU
orderSchema.statics.search = async ({ page, query }) => {
  const orders = await Order.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { sku: { $regex: query, $options: 'i' } }
    ]
  })

  return orders
}

// Update order
orderSchema.statics.updateOrder = async (orderId, orderDetails) => {
  const order = await Order.updateOne({ id: orderId }, orderDetails)
  return order
}

// Delete order
orderSchema.statics.deleteOrder = async (orderId) => {
  const order = await Order.deleteOne({ id: orderId })
  return order
}

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
