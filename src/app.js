const express = require('express')
const cors = require('cors')
const mongoRouters = require('./routers/mongo/index.js')
const uploadcareRouters = require('./routers/uploadcare/index.js')
const oauth = require('./routers/mongo/oauth.js')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3060
require('./db/db')

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use('/oauth/', oauth)
app.use('/v1/', mongoRouters)
app.use('/v1/images', uploadcareRouters)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
