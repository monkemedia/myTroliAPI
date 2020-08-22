const brandSchema = require('./schema')
const Product = require('../product')
const { getModelByTenant } = require('../../utils/multitenancy');

exports.Brand = function (req) {
  const tenantId = 'trolify_dutchpot'
  console.log(this)

  // Get brands
  brandSchema.statics.findBrands = async ({ page, limit }) => {
    const getModel = this.getModel()
    const brands = await getModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
    

    const total = await getModel.countDocuments()
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

  // // Search brands by Name or Search Keywords
  // this.brandSchema.statics.search = async ({ page, limit, keyword }) => {
  //   const searchArray = [
  //     { name: { $regex: keyword, $options: 'i' } },
  //     { search_keywords: { $regex: keyword, $options: 'i' } }
  //   ]
  //   const brands = await Brand
  //     .find()
  //     .or(searchArray)
  //     .skip((page - 1) * limit)
  //     .limit(limit)

  //   const total = await Brand.countDocuments(searchArray)
  //   return {
  //     data: brands,
  //     meta: {
  //       pagination: {
  //         current: page,
  //         total: brands.length
  //       },
  //       results: {
  //         total: total
  //       }
  //     }
  //   }
  // }

  // // Get brand count
  // this.brandSchema.statics.getCount = async () => {
  //   const total = await Brand.countDocuments()
  //   return {
  //     count: total
  //   }
  // }

  // // Update brand
  // this.brandSchema.statics.updateBrand = async (brandId, brandDetails) => {
  //   const brand = await Brand.updateOne({ _id: brandId }, brandDetails)
  //   return brand
  // }

  // // Delete brand
  // this.brandSchema.statics.deleteBrand = async (brandId) => {
  //   // Delete the brand id from products that have it
  //   await Product.updateMany({ brand_id: brandId }, { $unset: { brand_id: 1 }})
  //   const brand = await Brand.deleteOne({ _id: brandId })
  //   return brand
  // }

  this.getModel = function () { 
    return getModelByTenant(tenantId, 'Brand', brandSchema)
  }
}
