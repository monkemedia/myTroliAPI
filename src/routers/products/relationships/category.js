const express = require('express')
const Product = require('../../../models/product/Product')
const CategoryRelationship = require('../../../models/product/relationships/Category')
const auth = require('../../../middleware/auth')
const router = express.Router()

// Create a new Category Relationship
router.post('/products/:productId/relationships/categories', auth, async (req, res) => {
  const data = req.body.data
  const _id = req.params.productId

  if (!data.some(n => n.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(n => n.type !== 'category')) {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  if (!data.some(n => n.category_id)) {
    return res.status(401).send({
      message: 'Category ID is required'
    })
  }

  try {
    const categories = new CategoryRelationship({
      categories: [
        ...data
      ]
    })

    await categories.save()

    console.log('HERE', data)

    const product = await Product.findByIdAndUpdate({ _id }, {
      $addToSet: {
        'relationships.categories': data
      }
    })
    console.log('PRODUCT', product)

    res.status(201).send(categories)
  } catch (err) {
    res.status(400).send(err)
  }
})

// Update Category Relationship
router.put('/products/:productId/relationships/categories', auth, async (req, res) => {
  const _id = req.params.addressId
  const data = req.body.data
  const { type, first_name, last_name, company_name, line_1, line_2, city, county, postcode, country, phone_number, instructions } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'address') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const address_id = req.params.addressId
    const currentAddress = await Address.findAddress(address_id)

    const data = {
      type,
      _id,
      first_name: first_name || currentAddress.first_name,
      last_name: last_name || currentAddress.last_name,
      company_name: company_name || currentAddress.company_name,
      line_1: line_1 || currentAddress.line_1,
      line_2: line_2 || currentAddress.line_2,
      city: city || currentAddress.city,
      county: county || currentAddress.county,
      postcode: postcode || currentAddress.postcode,
      country: country || currentAddress.country,
      phone_number: phone_number || currentAddress.phone_number,
      instructions: instructions || currentAddress.instructions,
      default: req.body.default || currentAddress.default
    }

    await Address.updateAddress(data)

    res.status(200).send({ data })
  } catch (err) {
    res.status(400).send(err)
  }
})

module.exports = router
