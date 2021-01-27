const mongoose = require('mongoose')
const BrandSchema = require('./schema')
const Product = require('../product')

// Get brands
BrandSchema.statics.findBrands = async ({ page, limit, store_hash }) => {
  const brands = await Brand
    .find({ store_hash })
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Brand.countDocuments({ store_hash })
  
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
BrandSchema.statics.search = async ({ page, limit, keyword, store_hash }) => {
  const searchArray = [
    { name: { $regex: keyword, $options: 'i' } },
    { search_keywords: { $regex: keyword, $options: 'i' } }
  ]
  const brands = await Brand
    .find({ store_hash })
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Brand.find({ store_hash }).countDocuments(searchArray)
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
BrandSchema.statics.getCount = async (store_hash) => {
  const total = await Brand.countDocuments({ store_hash })
  return {
    count: total
  }
}

// Update brand
BrandSchema.statics.updateBrand = async (brandId, brandDetails) => {
  const brand = await Brand.updateOne({ _id: brandId }, brandDetails)
  return brand
}

// Delete brand
BrandSchema.statics.deleteBrand = async (brandId) => {
  // Delete the brand id from products that have it
  await Product.updateMany({ brand_id: brandId }, { $unset: { brand_id: 1 }})
  const brand = await Brand.deleteOne({ _id: brandId })
  return brand
}

const Brand = mongoose.model('Brand', BrandSchema)

module.exports = Brand
