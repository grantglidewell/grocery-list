const express = require('express');
const mysql = require('mysql');
const path = require('path');

const server = express();
const connection = mysql.createConnection(process.env.JAWSDB_URL);

connection.connect();
server.use(express.static(path.resolve(__dirname, 'build')));

server.get('/api/data/:session', (req, res) => {
  connection.query(`SELECT * from todos WHERE owner='${req.params.session}'`, (err, rows) => {
    if (err) console.log(err);
    return res.json(rows);
  });
});

server.post('/api/post/:text/:session', (req, res) => {
  let newRows;
  connection.query('INSERT INTO todos (owner, todo) VALUES (?,?)', [req.params.session, req.params.text], (err, rows) => {
    if (err) console.log(err);
    newRows = rows;
    return rows;
  });
  return res.sendStatus(201, newRows);
});


server.get('/api/delete/:id', (req, res) => {
  const newID = req.params.id.replace(/[A-z]/g, ' ').trim().slice(0, -4);
  connection.query('DELETE FROM todos WHERE id =?', [newID], (err, rows) => {
    if (err) console.log(err);
    console.log(rows);
    return rows.changedRows;
  });
  return res.sendStatus(200);
});

server.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

server.listen(process.env.PORT || 3001, () => {
  console.log('listening');
});
