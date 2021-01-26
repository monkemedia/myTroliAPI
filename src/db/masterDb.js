const mongoose = require('mongoose')
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}

mongoose.connect(process.env.MONGODB_BASE_URL + '/trolify', options)
