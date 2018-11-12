const mongoose = require('mongoose')
// simple schema, see mongodb schema docs
const Schema = new mongoose.Schema({
  todo: {
    type: String,
    required: true
  },
  session: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    required: false
  }
})

const Todo = (module.exports = mongoose.model('todo', Schema))
