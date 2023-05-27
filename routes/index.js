//importing express
const express = require('express');

//importing function to get a unique id from uuid package
const { v4: uuidv4 } = require('uuid');

//importing fs and util modules
const fs = require('fs');
const util = require('util');

//defining readFromFile
const readFromFile = util.promisify(fs.readFile);

//defining writeToFile
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
  
  //defining readAndAppend
  const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
}

//creating instance of express
const app = express();

// GET route
app.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data))
  );}
);

// POST route
app.post('/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    const newNote = {
        title,
        text,
        id: uuidv4(),
    }
    if(newNote.title){
        readAndAppend(newNote, './db/db.json');
        res.json('note was successfully added');
    } 
}
);

// DELETE route
app.delete('/notes/:id', (req, res) => {

    const trashNote = {
        id: req.params.id,
    }

    readFromFile('./db/db.json', (err, data) => {
        if(err) throw err;
        for(let i = 0; i < data.length; i++ ){
            if(data[i] === trashNote.id){
                const updatedData = data.splice(i, 1);
                writeToFile('./db/db.json', updatedData);
            }
        }
    })
})

module.exports = app;
