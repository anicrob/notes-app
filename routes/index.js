const express = require('express');

const app = express();

app.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data))
  );}
);

app.post('/post', (req, res) => {
    console.log('add code here');
}
);

module.exports = app;
