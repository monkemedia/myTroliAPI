if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const express = require('express')
const cors = require('cors')
const dbRoutes = require('./routers')
const oauth = require('./routers/oauth.js')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3060
const app = express()

require('./db/masterDb.js')

const corsOptions = {
  origin: process.env.WEB_ADDRESS,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/oauth/', oauth)
app.use('/v1', dbRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
