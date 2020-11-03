const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/Validation-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// создать пользователя
const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)

    .then((hash) => User.create({
      email,
      password: hash,
      name: name || 'Имя',
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Заполните все поля');
      } else if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })

    .then((user) => {
      const newUser = user;
      newUser.password = '';
      res.status(200).send({ data: newUser });
    })

    .catch(next);
};

// аунтификация
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(next);
};

// вернуть информацию о пользователе (email и имя)
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Такой пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUser,
};
