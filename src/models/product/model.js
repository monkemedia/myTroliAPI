const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const currencySymbol = require('currency-symbol-map')
const productSchema = require('./schema')

productSchema.plugin(deepPopulate)

function formatCurrency (amount, currency) {
  return currencySymbol(currency) + amount
}

function updateMeta (product, amount, currency, stock) {
  return {
    display_price: {
      currency,
      formatted: formatCurrency(amount, currency)
    },
    stock: {
      level: product.stock,
      availability: stock === 0 ? 'out-stock' : 'in-stock'
    }
  }
}

// Add meta data before saving
productSchema.pre('save', async function (next) {
  const product = this
  const amount = product.price.amount
  const currency = product.price.currency
  const stock = product.stock

  // product.created_at = Date.now
  product.meta = updateMeta(product, amount, currency, stock)
  next()
})

// Get all products
productSchema.statics.findAllProducts = async ({ page, limit }) => {
  const products = await Product.find({}).sort('-created_at').populate('relationships.categories relationships.files variants').skip((page - 1) * limit).limit(limit)
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
  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { sku: { $regex: query, $options: 'i' } }
    ]
  })

  return {
    data: products,
    meta: {
      pagination: {
        current: page,
        total: products.length
      },
      results: {
        total: products.length
      }
    }
  }
}

// Get product by product id
productSchema.statics.findById = async (_id) => {
  const product = await Product.findOne({ _id }).populate('variants').deepPopulate('variants.options')
  return product
}

// Update product
productSchema.statics.updateProduct = async (productDetails) => {
  const { _id, price, stock } = productDetails
  productDetails.updated_at = new Date()
  const data = {
    ...productDetails,
    meta: updateMeta(productDetails, price.amount, price.currency, stock)
  }

  await Product.updateOne({ _id }, data)
  return data
}

// Delete product by id
productSchema.statics.deleteProduct = async (_id) => {
  const product = await Product.deleteOne({ _id })
  return product
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product
