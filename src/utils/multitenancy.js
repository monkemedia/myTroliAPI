const { Mongoose } = require('mongoose')
const multitenantPool = {}

const getTenantDB = function getConnections(storeHash, modelName, schema) {
  // Check connections lookup
  const mCon = multitenantPool[storeHash]
  if (mCon) {
    if (!mCon.modelSchemas[modelName]) {
      mCon.model(modelName, schema)
    }
    return mCon
  }


  const mongoose = new Mongoose()
  const url = 'mongodb://localhost:27017/trolify'.replace(/trolify/, storeHash)
  mongoose.connect(url)
  multitenantPool[storeHash] = mongoose
  mongoose.model(modelName, schema)
  mongoose.connection.on('error', err => console.log(err))
  mongoose.connection.once('open', () => console.log(`mongodb connected to ${url}`))
  return mongoose
}

exports.getModelByTenant = function (req, modelName, schema) {
  const storeHash = req.params.storeHash
  const tenantDb = getTenantDB(storeHash, modelName, schema)
  return tenantDb.model(modelName)
}
