require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const errorMessages = require('./utils/errorMessages');
const { errors } = require('celebrate');
const errorHandler = require('./utils/errorHandler');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true
})
  .then(() => console.log('Connected to DB'))
  .catch(() => console.log('Can not connect to DB'));

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger);

app.use('/', router);

app.use((req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundError));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
