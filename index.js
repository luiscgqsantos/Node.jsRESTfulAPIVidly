const mongoose = require('mongoose');
const genres = require('./routes/genres');
const costumers = require('./routes/costumers');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/costumers', costumers);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));