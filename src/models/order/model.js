const mongoose = require('mongoose')
const orderSchema = require('./schema')
const Product = require('../product/index.js')
const ProductVariants = require('../product/variant/index.js')
const AutoIncrement = require('mongoose-sequence')(mongoose)

orderSchema.plugin(AutoIncrement, {
  inc_field: 'id',
  start_seq: 100
})

async function decreaseProductStock ({ productId, variantId, currentStock, qty }) {
  const newStock = currentStock - qty
  let update

  if (productId) {
    update = await Product.updateOne({ _id: productId }, {
      stock: newStock
    })
  } else {
    update = await ProductVariants.updateOne({ _id: variantId }, {
      stock: newStock
    })
  }

  return update
}

async function stockLevelHandler (product) {
  // Does product have options
  const variantId = product.variant_id
  const productId = product.product_id
  const productOptions = product.product_options
  if (variantId) {
    return productOptions.map(async () => {
      const productVariant = await ProductVariants.findOne({ _id: variantId })
      return productVariant.stock
    })
  }
  // Product doesn't have options
  const prod = await Product.findOne({ _id: productId })
  return prod.stock
}

// async function changeProductStock (id, stock, quantity, isVariant = false) {
//   const currentStock = stock
//   const newStock = currentStock - quantity
//   let update

//   if (!isVariant) {
//     update = await Product.updateOne({ _id: id }, {
//       stock: newStock
//     })
//   } else {
//     update = await ProductVariants.updateOne({ _id: id }, {
//       stock: newStock
//     })
//   }

//   return update
// }

// async function stockCheckMethod (order) {
//   const promise = await order.products.map(async (orderProduct) => {
//     // Check to see if its a variant first
//     if (orderProduct.product_options.length > 0) {
//       orderProduct.product_options.map(async (po) => {
//         const productVariant = await ProductVariants.findOne({ _id: po.variant_id })
//         if (orderProduct.quantity > productVariant.stock) {
//           return false
//         }
//         await changeProductStock(productVariant._id, productVariant.stock, orderProduct.quantity, true)
//         return true
//       })
//     } else {
//       const productId = orderProduct.product_id
//       const product = await Product.findOne({ _id: productId })

//       if (orderProduct.quantity > product.stock) {
//         return false
//       }
//       await changeProductStock(product._id, product.stock, orderProduct.quantity)
//       return true
//     }
//   })

//   return Promise.all(promise)
//   // const product = await Product.findOne({ _id: productId })
// }

// Check stock before creating order
orderSchema.pre('save', async function (next) {
  const order = this
  const orderProducts = order.products

  const promise = await orderProducts.map(async orderProduct => {
    const productId = orderProduct.product_id
    const productName = orderProduct.name
    const variantId = orderProduct.variant_id
    const orderQty = orderProduct.quantity
    const stockLevel = await stockLevelHandler(orderProduct)
    if (orderQty > stockLevel) {
      throw new Error(`Product \`${productName}\` is out of stock`)
    }
    // There is enough stock, so decrease stock
    decreaseProductStock({
      currentStock: stockLevel,
      qty: orderQty,
      variantId,
      productId
    })
    next()
  })

  await Promise.all(promise)
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
  // const currentOrderQty =
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
