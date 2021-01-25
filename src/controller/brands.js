const Brand = require('../models/brand')

const createBrand = async (req, res) => {
  const data = req.body
  const { type, name } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'brands') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  try {
    const brand = new Brand(data)
    await brand.save()

    res.status(201).send(brand)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getBrands = async (req, res) => {
  const query = req.query
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 20
  const keyword = query && query.keyword
  let brands

  try {
    if (keyword) {
      brands = await Brand.search({ page, limit, keyword })
    } else {
      brands = await Brand.findBrands({ page, limit })
    }

    res.status(200).send(brands)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getBrand = async (req, res) => {
  const brandId = req.params.brandId
  let brand
  if (brandId === 'count') {
    brand = await Brand.getCount()
  } else {
    brand = await Brand.findOne({ _id: brandId })
  }

  res.status(200).send(brand)
}

const updateBrand = async (req, res) => {
  const brandId = req.params.brandId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'brands') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await Brand.updateBrand(brandId, data)
    const updatedBrand = await Brand.findOne({ _id: brandId })

    res.status(200).send(updatedBrand)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteBrand = async (req, res) => {
  try {
    await Brand.deleteBrand(req.params.brandId)

    res.status(200).send({
      message: 'Brand successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand
}
