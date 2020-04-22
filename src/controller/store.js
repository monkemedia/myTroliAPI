const Store = require('../models/store/index.js')

const createStore = async (req, res) => {
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'store') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    const store = new Store(data)

    await store.save()
    res.status(201).send(store)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getStore = async (req, res) => {
  const store = await Store.findOne()

  res.status(200).send(store)
}

const updateStore = async (req, res) => {
  const storeId = req.params.storeId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'store') {
    return res.status(401).send({
      message: 'Correct Type is required'
    })
  }

  try {
    await Store.updateStore(storeId, data)
    const store = await Store.findOne({ _id: storeId })

    res.status(200).send(store)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteStore = async (req, res) => {
  try {
    const storeId = req.params.storeId

    await Store.deleteStore(storeId)

    res.status(200).send({
      message: 'Store successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createStore,
  getStore,
  updateStore,
  deleteStore
}
