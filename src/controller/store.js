const Store = require('../models/store/index.js')

const createStore = async (req, res) => {
  const data = req.body
  const { type } = data

  // Lets see if a store already exists
  const store = await Store.findOne()

  if (store) {
    return res.status(401).send({
      message: 'There is already a store'
    })
  }

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
    await Store.updateStore(data)
    const store = await Store.findOne()

    res.status(200).send(store)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteStore = async (req, res) => {
  try {
    await Store.deleteStore()

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
