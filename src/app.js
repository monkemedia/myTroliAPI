const express = require('express')
const cors = require('cors')
const dbRoutes = require('./routers/index.js')
const fileRoute = require('./routers/files.js')
const oauth = require('./routers/oauth.js')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3060
const app = express()

require('./db/db')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/oauth/', oauth)
app.use('/v1/', dbRoutes)
app.use('/v1/files', fileRoute)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
