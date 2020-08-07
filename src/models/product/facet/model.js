const mongoose = require('mongoose')
const productFacetSchema = require('./schema')
const Product = require('../model')

// Get product facets
productFacetSchema.statics.findProductFacets = async (productId) => {
  const productFacets = await ProductFacets
    .find({ product_id: productId })
    .sort({ sort_order: 1 })

  return productFacets
}

// Update product facet
productFacetSchema.statics.updateProductFacet = async (facetId, productFacetDetails) => {
  const productFacet = await ProductFacets.updateOne({ _id: facetId }, {
    ...productFacetDetails,
    updated_at: Date.now()
  })
  return productFacet
}

// Delete product facet
productFacetSchema.statics.deleteProductFacet = async (facetId, productId) => {
  await Product.updateOne({ _id: productId }, {
    $pull: {
      facets: facetId
    },
    updated_at: Date.now()
  })
  const productFacet = await ProductFacets.deleteOne({ _id: facetId })
  return productFacet
}

const ProductFacets = mongoose.model('ProductFacets', productFacetSchema)

module.exports = ProductFacets
