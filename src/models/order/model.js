const mongoose = require('mongoose')
const orderSchema = require('./schema')
const Product = require('../product/index.js')
const ProductVariants = require('../product/variant/index.js')
const AutoIncrement = require('mongoose-sequence')(mongoose)

orderSchema.plugin(AutoIncrement, {
  inc_field: 'id',
  start_seq: 100
})

async function updateProductStock (id, stock, quantity, isVariant = false) {
  const currentStock = stock
  const newStock = currentStock - quantity
  let update

  if (!isVariant) {
    update = await Product.updateOne({ _id: id }, {
      stock: newStock
    })
  } else {
    update = await ProductVariants.updateOne({ _id: id }, {
      stock: newStock
    })
  }

  return update
}

async function stockCheckMethod (order) {
  const promise = await order.products.map(async (orderProduct) => {
    // Check to see if its a variant first
    if (orderProduct.product_options.length > 0) {
      orderProduct.product_options.map(async (po) => {
        console.log('PO', po)
        const productVariant = await ProductVariants.findOne({ _id: po.variant_id })
        console.log('THE VARIANT', productVariant.stock)
        console.log('quantity', orderProduct.quantity)
        if (orderProduct.quantity > productVariant.stock) {
          console.log('monkey')
          return false
        }
        await updateProductStock(productVariant._id, productVariant.stock, orderProduct.quantity, true)
        return true
        // console.log('UPDATE PRODUCT VARIANT STOCK')
      })
    } else {
      console.log('NOT HERE')
      const productId = orderProduct.product_id
      const product = await Product.findOne({ _id: productId })

      if (orderProduct.quantity > product.stock) {
        return false
      }
      await updateProductStock(product._id, product.stock, orderProduct.quantity)
      return true
    }
  })

  return Promise.all(promise)
  // const product = await Product.findOne({ _id: productId })
}

// Check stock before creating order
orderSchema.pre('save', async function (next) {
  const order = this
  const stockCheck = await stockCheckMethod(order)
  console.log(stockCheck)
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
