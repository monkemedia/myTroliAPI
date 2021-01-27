const ProductFiltering = require('../models/productFiltering')

const updateFacetSettings = async (req, res) => {
  const data = req.body
  const { type } = data
  const storeHash = req.params.storeHash

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
    await ProductFiltering.updateFacetSettings(data, storeHash)
    const facets = await ProductFiltering.findFacetSettings(storeHash)

    res.status(200).send(facets)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getFacetSettings = async (req, res) => {
  const storeHash = req.params.storeHash
  try {
    const facets = await ProductFiltering.findFacetSettings(storeHash)

    res.status(200).send(facets)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getFacets = async (req, res) => {
  const storeHash = req.params.storeHash
  try {
    const facets = await ProductFiltering.findFacets(storeHash)

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
