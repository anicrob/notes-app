//importing express
const express = require('express');

//importing function to get a unique id from uuid package
const { v4: uuidv4 } = require('uuid');

//importing fs and util modules
const fs = require('fs');
const util = require('util');

//creating instance of express
const app = express();

//promisify the fs functions
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

// GET route
app.get('/notes', (req, res) => {
    readFromFile('./db/db.json')
        .then(notes => res.json(JSON.parse(notes)))
        .catch((err) => {
            res.status(500)
            .json(err)
        })
    });

// POST route
app.post('/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    const newNote = {
        title,
        text,
        id: uuidv4(),
    }

    readFromFile('./db/db.json')
        .then((notes) => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes))
            } catch (error) {
                parsedNotes = []
            }
            return parsedNotes
        })
        .then(parsedNotes => [...parsedNotes, newNote])
        .then(updatedNotes => writeToFile('./db/db.json', JSON.stringify(updatedNotes)))
        .then(updatedNotes => res.status(200).json(updatedNotes))
        .catch((err) => {
            res.status(500)
            .json(err)
        })
    }
);

// DELETE route
app.delete('/notes/:id', (req, res) => {
    readFromFile('./db/db.json')
    .then((notes) => {
        let parsedNotes;
        try {
            parsedNotes = [].concat(JSON.parse(notes))
        } catch (error) {
            parsedNotes = []
        }
        return parsedNotes
    })    
    .then((notes) => notes.filter(note => note.id !== req.params.id))
    .then(updatedNotes => writeToFile('./db/db.json', JSON.stringify(updatedNotes)))
    .then(() => res.json({ok: true}))
    .catch((err) => {
        res.status(500)
        .json(err)
    })
})

module.exports = app;
