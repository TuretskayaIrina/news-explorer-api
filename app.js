const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { login } = require('./controllers/user');
const { createUser } = require('./controllers/user');
const usersRouter = require('./routes/user');
const articlesRouter = require('./routes/article');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use(require('cors')());

// используем  env-переменные
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

// проверяет переданные в теле почту и пароль
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(30),
  }),
}), login);

// создаёт пользователя с переданными в теле email, password и name
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(10).required().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/),
    name: Joi.string().min(2).max(30),
  }).unknown(true),
}), createUser);

app.use(auth); // защищаем все ниже перечисленные роуты авторизацией

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
