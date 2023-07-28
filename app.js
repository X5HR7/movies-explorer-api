const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true
})
  .then(() => console.log('Connected to DB'))
  .catch(() => console.log('Can not connect to DB'));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
