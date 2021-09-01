const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const currentNotes = require ('./db/db.json');

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ==================================================

app.get('/api/notes', (req, res) => {
    res.status(200).send(currentNotes);
})

app.post('/api/notes', (req, res) => {
    currentNotes.push(req.body);
    currentNotes.forEach((note, i) => {
        note.id = i + 1;
    });

    fs.writeFile('./db/db.json', JSON.stringify(currentNotes), function () {
        res.status(200).send(currentNotes);
    });
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join
        (__dirname, '/public/notes.html'))
})

app.get('/', (req, res) => {
    res.sendFile(path.join
        (__dirname, 'public/index.html'))
});

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);

app.delete('/api/notes/:id', (req, res) => {
    let newNote = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
    let noteID = (req.params.id).toString();

    newNote = newNote.filter(selected =>{
        return selected.id != noteID;
    })

    fs.writeFileSync('db/db.json', JSON.stringify(newNote));
    res.json(newNote);

    console.log('Note Successfully Deleted. Refresh to see new list.')
});