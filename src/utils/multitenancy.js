const { Mongoose } = require('mongoose')
const multitenantPool = {}

const getTenantDB = function getConnections(modelName, schema) {
  const storeHash = 'trolify_dutchpot'
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
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  mongoose.connect(url, options)
  multitenantPool[storeHash] = mongoose
  mongoose.model(modelName, schema)
  mongoose.connection.on('error', err => console.log(err))
  mongoose.connection.once('open', () => console.log(`mongodb connected to ${url}`))
  return mongoose
}

exports.tenantModel = function (modelName, schema) {
  const tenantDb = getTenantDB(modelName, schema)
  return tenantDb.model(modelName)
}
