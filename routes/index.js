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
    //read the file
    readFromFile('./db/db.json')
        //send response of the parsed data
        .then(notes => res.json(JSON.parse(notes)))
        //catch errors
        .catch((err) => {
            res.status(500)
            .json(err)
        })
    });

// POST route
app.post('/notes', (req, res) => {
    //destructured the request body
    const { title, text } = req.body;
    //create a new note object with a unique id
    const newNote = {
        title,
        text,
        id: uuidv4(),
    }
    //read the file first
    readFromFile('./db/db.json')
    //make the data an array and return it
        .then((notes) => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes))
            } catch (error) {
                parsedNotes = []
            }
            return parsedNotes
        })
        //then use the spread array method to join the parsedNotes read from the file with the new note
        .then(parsedNotes => [...parsedNotes, newNote])
        //then write those updated notes to the file
        .then(updatedNotes => writeToFile('./db/db.json', JSON.stringify(updatedNotes)))
        //then send a response of the status and updated notes
        .then(updatedNotes => res.status(200).json(updatedNotes))
        //catch any errors 
        .catch((err) => {
            res.status(500)
            .json(err)
        })
    }
);

// DELETE route
app.delete('/notes/:id', (req, res) => {
    //read from file
    readFromFile('./db/db.json')
    //make data from file an array and return it
    .then((notes) => {
        let parsedNotes;
        try {
            parsedNotes = [].concat(JSON.parse(notes))
        } catch (error) {
            parsedNotes = []
        }
        return parsedNotes
    })    
    //then filter out notes where the params id and note.id do not match
    .then((notes) => notes.filter(note => note.id !== req.params.id))
    //then write that new data to the file
    .then(updatedNotes => writeToFile('./db/db.json', JSON.stringify(updatedNotes)))
    //it was successful/ok
    .then(() => res.json({ok: true}))
    //catch errors
    .catch((err) => {
        res.status(500)
        .json(err)
    })
})

//export app
module.exports = app;
