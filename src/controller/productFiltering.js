const ProductFiltering = require('../models/productFiltering')

const updateFacetSettings = async (req, res) => {
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type && type !== 'product-filtering') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await ProductFiltering.updateFacetSettings(data)
    const facets = await ProductFiltering.findFacetSettings()

    res.status(200).send(facets)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getFacetSettings = async (req, res) => {
  try {
    const facets = await ProductFiltering.findFacetSettings()

    res.status(200).send(facets)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getFacets = async (req, res) => {
  try {
    const facets = await ProductFiltering.findFacets()

    res.status(200).send(facets)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  updateFacetSettings,
  getFacetSettings,
  getFacets
}
