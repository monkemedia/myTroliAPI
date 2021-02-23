const mongoose = require('mongoose')
const ProductFilteringSchema = require('./schema')
const Product = require('../product')

// Update facet settings
ProductFilteringSchema.statics.updateFacetSettings = async (data, store_hash) => {
  const facets = await ProductFiltering.findOneAndUpdate({ type: 'product-filtering', store_hash }, {
    ...data,
    updated_at: Date.now()
  }, {
    upsert: true
  })

  return facets
}

// Get facet settings
ProductFilteringSchema.statics.findFacetSettings = async (store_hash) => {
  const facetSettings = await ProductFiltering.findOne({ store_hash })
  return facetSettings
}

// Get facets
ProductFilteringSchema.statics.findFacets = async (store_hash) => {
  const facets = await Product
    .aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand_id',
          foreignField: '_id',
          as: 'brands'
        }
      },
      {
        $lookup: {
          from: 'productoptions',
          localField: 'options',
          foreignField: '_id',
          as: 'options'
        }
      },
      {
        $lookup: {
          from: 'productcustomfields',
          localField: 'custom_fields',
          foreignField: '_id',
          as: 'custom_fields'
        }
      },
      {
        $match: { store_hash }
      },
      {
        $facet: {
          categories: [
            { $unwind: '$categories' },
            { $group: { _id: '$categories.name', count: { $sum: 1 } } }
            // { $sort: { _id: 1 } }
          ],
          brands: [
            { $unwind: '$brands' },
            { $group: { _id: '$brands.name', count: { $sum: 1 } } }
          ],
          colours: [
            { $unwind: '$options' },
            {
              $match: { 'options.display_name': 'Colour' }
            },
            { $unwind: '$options.option_values' },
            { $group: { _id: '$options.option_values.label', count: { $sum: 1 } } }
          ],
          sizes: [
            { $unwind: '$options' },
            {
              $match: { 'options.display_name': 'Size' }
            },
            { $unwind: '$options.option_values' },
            { $group: { _id: '$options.option_values.label', count: { $sum: 1 } } }
          ],
          custom_fields_colour: [
            { $unwind: '$custom_fields' },
            {
              $match: { 'custom_fields.name': 'Colour' }
            },
            { $group: { _id: '$custom_fields.value', count: { $sum: 1 } } }
          ],
          custom_fields_size: [
            { $unwind: '$custom_fields' },
            {
              $match: { 'custom_fields.name': 'Size' }
            },
            { $group: { _id: '$custom_fields.value', count: { $sum: 1 } } }
          ],
          custom_fields: [
            { $unwind: '$custom_fields' },
            {
              $match: {
                $and: [
                  { 'custom_fields.name': { $ne: 'Size' } },
                  { 'custom_fields.name': { $ne: 'Colour' } }
                ]
              }
            },
            {
              $group: {
                _id: {
                  name: '$custom_fields.name',
                  value: '$custom_fields.value'
                },
                count: { $sum: 1 }
              }
            }
          ],
          is_featured: [
            { $match: { 'is_featured': { $eq: true } } },
            { $group: { _id: 'Featured', count: { $sum: 1 } } },
          ],
          has_free_shipping: [
            { $match: { 'has_free_shipping': { $eq: true } } },
            { $group: { _id: 'Free shipping', count: { $sum: 1 } } }
          ],
          on_sale: [
            { $match: { 'on_sale': { $eq: true } } },
            { $group: { _id: 'On sale', count: { $sum: 1 } } }
          ]
        }
      },
      {
        $project: {
          categories: 1,
          brands: 1,
          colours: {
            $setUnion: ['$colours', '$custom_fields_colour']
          },
          sizes: {
            $setUnion: ['$sizes', '$custom_fields_size']
          },
          custom_fields: 1,
          other: {
            $setUnion: ['$is_featured', '$has_free_shipping', '$on_sale']
          }
        }
      }
    ])

  return facets
}

const ProductFiltering = mongoose.model('ProductFiltering', ProductFilteringSchema)

module.exports = ProductFiltering
