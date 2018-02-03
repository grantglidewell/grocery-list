const express = require('express');
const mysql = require('mysql');
const path = require('path');

const server = express();
const connection = mysql.createConnection(process.env.JAWSDB_URL);

server.use(express.static(path.resolve(__dirname, 'build')));

// this should return my react page
server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

server.get('/api/data/:session', (req, res) => {
  connection.connect();
  connection.query(`SELECT * from todos WHERE owner='${req.params.session}'`, (err, rows) => {
    if (err) throw err;
    return res.json(rows);
  });
  connection.end();
});

server.post('/api/post/:text/:session', (req, res) => {
  connection.connect();
  connection.query(`INSERT INTO todos (owner, todo) VALUES('${req.params.session}', '${req.params.text}')`, (err, rows) => {
    if (err) throw err;
    return res(rows);
  });
  connection.end();
});


server.delete('/api/delete/:id', (req, res) => {
  connection.connect();
  connection.query(`DELETE FROM todos WHERE id=${req.params.id}`, (err, rows) => {
    if (err) throw err;
    return res(rows);
  });
  connection.end();
});

server.listen(process.env.PORT || 3001, () => {
  console.log('listening');
});
