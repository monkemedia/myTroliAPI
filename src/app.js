const express = require('express')
const routers = require('./routers/index.js')
const oauth = require('./routers/oauth.js')
const bodyParser = require('body-parser')

const port = process.env.PORT
require('./db/db')

const app = express()

app.use(bodyParser.json())
app.use('/oauth/', oauth)
app.use('/v1/', routers)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
