const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
    User,
    validate
} = require('../models/user');

router.get('/', async (req, res) => {
    const user = await User.find().sort('name');
    res.send(user);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

router.post('/', async (req, res) => {

    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    await user.save();

    res.send(user);

});

module.exports = router;