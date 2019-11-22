const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
    Genre,
    validate
} = require('../models/genre');

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.post('/', auth, async (req, res) => {

    const {
        error
    } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {

    const {
        error
    } = validate(req.body)

    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true
    });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {

    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

module.exports = router;



//Ou usamos a dependencia express-async-errors ou caso não seja possivel
//é assim que temos que tratar da situação, juntamente com o middleware
//async criado por nós.
//const asyncMiddleware = require('../middleware/async');
// router.get('/', asyncMiddleware(async (req, res) => {
//     const genres = await Genre.find().sort('name');
//     res.send(genres);
// }));


//Middleware async
// module.exports = function (req, res, next) {
//     if (!req.user.isAdmin) return res.status(403).send('Access denied');

//     next();
// }