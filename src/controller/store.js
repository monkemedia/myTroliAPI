const Store = require('../models/store/index.js')

const getStore = async (req, res) => {
  try {
    const store_hash = req.params.storeHash
    const store = await Store.findOne({ store_hash })
    res.status(200).send(store)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateStore = async (req, res) => {
  const data = req.body
  const { type } = data
  const store_hash = req.params.storeHash

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'store') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await Store.updateStore(data, store_hash)
    const store = await Store.findOne({ store_hash })

    res.status(200).send(store)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getStore,
  updateStore
}
