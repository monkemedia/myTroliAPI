const { Mongoose } = require('mongoose')
const multitenantPool = {}

const getTenantDB = function getConnections(tenantId, modelName, schema) {
  // Check connections lookup
  const mCon = multitenantPool[tenantId]
  if (mCon) {
    if (!mCon.modelSchemas[modelName]) {
      mCon.model(modelName, schema)
    }
    return mCon
  }

  const mongoose = new Mongoose()
  const url = 'mongodb://localhost:27017/trolify'.replace(/trolify/, `trolify_${tenantId}`)
  mongoose.connect(url)
  multitenantPool[tenantId] = mongoose
  mongoose.model(modelName, schema)
  mongoose.connection.on('error', err => console.log(err))
  mongoose.connection.once('open', () => console.log(`mongodb connected to ${url}`))
  return mongoose
}

exports.getModelByTenant = (tenantId, modelName, schema) => {
  console.log(`getModelByTenant tenantId: ${tenantId}.`)
  const tenantDb = getTenantDB(tenantId, modelName, schema)
  return tenantDb.model(modelName)
}
