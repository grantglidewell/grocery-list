const express = require('express')
const mongoose = require('mongoose')
const Todo = require('./models/todo')
const path = require('path')

const server = express()

server.use(express.static(path.resolve(__dirname, 'build')))

mongoose.Promise = global.Promise

mongoose.connect(
  process.env.MONGODB_URI,
  { useMongoClient: true }
)

server.get('/api/data/:session', (req, res) => {
  Todo.find((err, data) => {
    if (err) {
      console.error(err)
    }
    return res.jsonp(data)
  })
})

server.get('/api/post/:text/:session', (req, res, next) => {
  const post = new Todo({
    todo: req.params.text,
    session: req.params.session
  })
  post.save((err, postText) => {
    if (err) {
      return next(err)
    }
    return res.sendStatus(201, postText)
  })
})

server.get('/api/delete/:id', (req, res) => {
  Todo.remove({ _id: req.params.id }, err => {
    if (!err) {
      res.sendStatus(200)
    } else {
      console.error(err)
    }
  })
})

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

server.listen(process.env.PORT || 3001, () => {
  console.log('listening')
})
