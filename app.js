const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { limiter } = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralHandlerErrors = require('./middlewares/centralHandlerErrors');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// используем модуль helmet для установки заголовков, связанных с безопасностью
app.use(helmet());

app.use(require('cors')());

// защита от ddos
app.use(limiter);

// используем  env-переменные
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.use('/', router); // подключаем все роуты

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use(centralHandlerErrors);

// Если всё работает, консоль покажет, какой порт приложение слушает
const { log } = console;
app.listen(PORT, () => {
  log(`App listening on port ${PORT}`);
});
