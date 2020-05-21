const mongoose = require('mongoose')
// const currencySymbol = require('currency-symbol-map')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const productSchema = require('./schema')

productSchema.plugin(deepPopulate)

// function formatCurrency (amount, currency) {
//   return currencySymbol(currency) + amount
// }

// function updateMeta (product, amount, currency, stock) {
//   return {
//     display_price: {
//       currency,
//       formatted: formatCurrency(amount, currency)
//     },
//     stock: {
//       level: product.stock,
//       availability: stock === 0 ? 'out-stock' : 'in-stock'
//     }
//   }
// }

// Add meta data before saving
// productSchema.pre('save', async function (next) {
//   const product = this
//   const amount = product.price.amount
//   const currency = product.price.currency
//   const stock = product.stock

//   product.meta = updateMeta(product, amount, currency, stock)
//   next()
// })

// Get all products
productSchema.statics.findProducts = async ({ page, limit }) => {
  const products = await Product
    .find({})
    .sort('-created_at')
    .populate('images')
    .deepPopulate('variants.images')
    .skip((page - 1) * limit)
    .limit(limit)
  const total = await Product.countDocuments()
  return {
    data: products,
    meta: {
      pagination: {
        current: page,
        total: products.length
      },
      results: {
        total
      }
    }
  }
}

// Search products by Name or SKU
productSchema.statics.search = async ({ page, query }) => {
  const products = await Product
    .find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('images')
    .deepPopulate('variants.images')

  return products
}

// Get product
productSchema.statics.findProduct = async (_id) => {
  const product = await Product
    .findOne({ _id })
    .populate('images')
    .deepPopulate('variants.images')
  return product
}

// Update product
productSchema.statics.updateProduct = async (productId, productDetails) => {
  productDetails.updated_at = new Date()
  const data = {
    ...productDetails
  }

  await Product
    .updateOne({ _id: productId }, data)
    .populate('images')
    .deepPopulate('variants.images')
}

// Delete product by id
productSchema.statics.deleteProduct = async (productId) => {
  const product = await Product.deleteOne({ _id: productId })
  return product
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product
