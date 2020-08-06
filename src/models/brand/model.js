const mongoose = require('mongoose')
const brandSchema = require('./schema')
const Product = require('../product')

// Get brands
brandSchema.statics.findBrands = async ({ page, limit }) => {
  const brands = await Brand
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Brand.countDocuments()
  return {
    data: brands,
    meta: {
      pagination: {
        current: page,
        total: brands.length
      },
      results: {
        total
      }
    }
  }
}

// Search brands by Name or Search Keywords
brandSchema.statics.search = async ({ page, limit, keyword }) => {
  const searchArray = [
    { name: { $regex: keyword, $options: 'i' } },
    { search_keywords: { $regex: keyword, $options: 'i' } }
  ]
  const brands = await Brand
    .find()
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Brand.countDocuments(searchArray)
  return {
    data: brands,
    meta: {
      pagination: {
        current: page,
        total: brands.length
      },
      results: {
        total: total
      }
    }
  }
}

// Get brand count
brandSchema.statics.getCount = async () => {
  const total = await Brand.countDocuments()
  return {
    count: total
  }
}

// Update brand
brandSchema.statics.updateBrand = async (brandId, brandDetails) => {
  const brand = await Brand.updateOne({ _id: brandId }, brandDetails)
  return brand
}

// Delete brand
brandSchema.statics.deleteBrand = async (brandId) => {
  // Delete the brand id from products that have it
  await Product.updateMany({ brand_id: brandId }, { $unset: { brand_id: 1 }})
  const brand = await Brand.deleteOne({ _id: brandId })
  return brand
}

const Brand = mongoose.model('Brand', brandSchema)

module.exports = Brand
