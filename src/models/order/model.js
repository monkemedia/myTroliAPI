const mongoose = require('mongoose')
const orderSchema = require('./schema')
const Product = require('../product/index.js')
const ProductVariants = require('../product/variant/index.js')
const AutoIncrement = require('mongoose-sequence')(mongoose)

orderSchema.plugin(AutoIncrement, {
  inc_field: 'id',
  start_seq: 100
})

async function updateProductStock ({ productId, variantId, currentStock, qty }, direction) {
  const newStock = direction === 'decrease' ? currentStock - qty : currentStock + qty
  let update

  if (variantId && productId) {
    update = await ProductVariants.updateOne({ _id: variantId }, {
      stock: newStock
    })
  } else {
    update = await Product.updateOne({ _id: productId }, {
      stock: newStock
    })
  }

  return update
}

async function stockLevelHandler (product) {
  // Does product have options
  const variantId = product.variant_id
  const productId = product.product_id
  if (productId && variantId) {
    const productVariant = await ProductVariants.findOne({ _id: variantId })
    return productVariant.stock
  }

  // Product doesn't have options
  const prod = await Product.findOne({ _id: productId })
  return prod.stock
}

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
    updateProductStock({
      currentStock: stockLevel,
      qty: orderQty,
      variantId,
      productId
    }, 'decrease')
    next()
  })

  await Promise.all(promise)
})

// Get orders
orderSchema.statics.findOrders = async ({ page, limit, statusId }) => {
  console.log('statusId', statusId)
  const findByStatusId = statusId ? { status_id: statusId } : null
  const orders = await Order
    .find(findByStatusId)
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

// Get orders count
orderSchema.statics.getCount = async () => {
  const total = await Order.countDocuments()
  return {
    count: total
  }
}

// Search orders by order id or customer name
orderSchema.statics.search = async ({ page, keyword, limit }) => {
  const searchString = new RegExp(decodeURIComponent(keyword), 'i')
  const searchQuery = {
    fullname: { $concat: ['$billing_address.first_name', ' ', '$billing_address.last_name'] }
  }
  const searchArray = { $or: [{ fullname: searchString }, { id: parseInt(keyword) || null }] }
  const orders = await Order
    .aggregate()
    .addFields(searchQuery)
    .match(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Order.countDocuments(searchArray)
  return {
    data: orders,
    meta: {
      pagination: {
        current: page,
        total: orders.length
      },
      results: {
        total: total
      }
    }
  }
}

// Update order
orderSchema.statics.updateOrder = async (orderId, orderDetails) => {
  // const currentOrderQty =
  const orderProducts = orderDetails.products

  if (orderProducts) {
    const promise = await orderProducts.map(async orderProduct => {
      const storedOrder = await Order.findOne({ id: orderId })
      const storedOrderProduct = storedOrder.products.find((order) => {
        return order._id.toString() === orderProduct._id
      })
      const storedOrderProductQty = storedOrderProduct ? storedOrderProduct.quantity : 0
      const orderQty = orderProduct.quantity
      const productName = orderProduct.name
      const productId = orderProduct.product_id
      const variantId = orderProduct.variant_id
      const stockLevel = await stockLevelHandler(orderProduct)

      // Quantity can not be 0 {
      if (orderQty === '' || orderQty === 0) {
        throw new Error(`Product \`${productName}\` quantity needs to be a valid amount`)
      }

      // Client has decreased order quantity, so increase stock level
      if (orderQty < storedOrderProductQty) {
        const stockToAdd = storedOrderProductQty - orderQty
        updateProductStock({
          currentStock: stockLevel,
          qty: stockToAdd,
          variantId,
          productId
        }, 'increase')
      } else if (orderQty > storedOrderProductQty) {
        const stockToRemove = orderQty - storedOrderProductQty
        if (stockToRemove > stockLevel) {
          throw new Error(`Product \`${productName}\` is out of stock`)
        }
        updateProductStock({
          currentStock: stockLevel,
          qty: stockToRemove,
          variantId,
          productId
        }, 'decrease')
      }
    })

    await Promise.all(promise)
  }
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
