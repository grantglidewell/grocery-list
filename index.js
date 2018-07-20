const app = require('express')();
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const path = require('path');

app.use(app.static(path.resolve(__dirname, 'build')));

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

app.get('/api/data/:session', (req, res) => {
  Todo.find((err, data) => {
    if (err) {
      console.error(err);
    }
    return res.jsonp(data);
  });
});

app.get('/api/post/:text/:session', (req, res, next) => {
  const post = new Todo({
    todo: req.params.text,
    session: req.params.session,
  });
  post.save((err, postText) => {
    if (err) {
      return next(err);
    }
    return res.sendStatus(201, postText);
  });
});

app.get('/api/delete/:id', (req, res) => {
  Todo.remove({ _id: req.params.id }, (err) => {
    if (!err) {
      res.sendStatus(200);
    } else {
      console.error(err);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 3001, () => {
  console.log('listening');
});
