const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const router = express.Router();

const Costumer = mongoose.model('Costumer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));


router.get('/', async (req, res) => {
    const costumers = await Costumer.find().sort('name');
    res.send(costumers);
});

router.get('/:id', async (req, res) => {
    const costumer = await Costumer.findById(req.params.id);

    if (!costumer) return res.status(404).send('The costumer with the given ID was not found.');

    res.send(costumer);
});

router.post('/', async (req, res) => {

    const {
        error
    } = validateCostumer(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let costumer = new Costumer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    costumer = await costumer.save();

    res.send(costumer);
});

router.put('/:id', async (req, res) => {

    const {
        error
    } = validateCostumer(req.body)

    if (error) return res.status(400).send(error.details[0].message);

    const costumer = await Costumer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, {
        new: true
    });

    if (!costumer) return res.status(404).send('The costumer with the given ID was not found.');

    res.send(costumer);
});

router.delete('/:id', async (req, res) => {

    const costumer = await Costumer.findByIdAndRemove(req.params.id);

    if (!costumer) return res.status(404).send('The costumer with the given ID was not found.');

    res.send(costumer);
});

function validateCostumer(costumer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(costumer, schema);
}

module.exports = router;