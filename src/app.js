const express = require('express')
const cors = require('cors')
const dbRoutes = require('./routers/index.js')
const imageRoute = require('./routers/image.js')
const oauth = require('./routers/oauth.js')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3060
require('./db/db')

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use('/oauth/', oauth)
app.use('/v1/', dbRoutes)
app.use('/v1/images', imageRoute)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
