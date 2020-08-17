const mongoose = require('mongoose')
const productFilteringSchema = require('./schema')
const Product = require('../product')

// Update facet settings
productFilteringSchema.statics.updateFacetSettings = async (data) => {
  const facets = await ProductFiltering.findOneAndUpdate({ type: 'product-filtering' }, {
    ...data,
    updated_at: Date.now()
  }, {
    upsert: true
  })

  return facets
}

// Get facet settings
productFilteringSchema.statics.findFacetSettings = async () => {
  const facetSettings = await ProductFiltering.findOne({})
  return facetSettings
}

// Get facets
productFilteringSchema.statics.findFacets = async () => {
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
          is_free_shipping: [
            { $match: { 'is_free_shipping': { $eq: true } } },
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
            $setUnion: ['$is_featured', '$is_free_shipping', '$on_sale']
          }
        }
      }
    ])

  return facets
}

// // Get facetsby name
// productFilteringSchema.statics.findFilterByName = async (filterName) => {
//   const filter = filterName.toLowerCase()
//   const facets = await Product
//     .aggregate([
//       { $unwind: '$facets' },
//       {
//         $match: {
//           'facets.name': { $regex: new RegExp(filter, 'i') }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             name: '$facets.value',
//             sort_order: '$facets.sort_order'
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.sort_order': 1 } }
//     ])

//   return facets
// }

const ProductFiltering = mongoose.model('ProductFiltering', productFilteringSchema)

module.exports = ProductFiltering
