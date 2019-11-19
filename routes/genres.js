const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost/vidly', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('could not connect to MongoDB...', err));



const genres = [{
        id: 1,
        name: 'action'
    },
    {
        id: 2,
        name: 'drama'
    },
    {
        id: 3,
        name: 'horror'
    },
    {
        id: 4,
        name: 'adventure'
    }
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {

    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.post('/', (req, res) => {

    const {
        error
    } = validateGenre(req.body)

    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre);

    res.send(genre);
});

router.put('/:id', (req, res) => {

    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    const {
        error
    } = validateGenre(req.body)

    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;

    res.send(genre);
});

router.delete('/:id', (req, res) => {

    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    const index = genres.indexOf(genre);

    genres.splice(index, 1);

    res.send(genre);
});

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema);
}

module.exports = router;