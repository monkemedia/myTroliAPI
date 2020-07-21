const Store = require('../models/store/index.js')

const getStore = async (req, res) => {
  try {
    const store = await Store.findOne()
    res.status(200).send(store)
  } catch (err) {
    res.status(400).send(err)
  }
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

module.exports = {
  getStore,
  updateStore
}
