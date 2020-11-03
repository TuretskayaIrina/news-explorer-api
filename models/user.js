const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/auth-error');

const userSchema = new mongoose.Schema({

  email: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    unique: true, // уникальное значение
    validate: { // валидация email
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  password: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    select: false, // свойство чтобы API не возвращал хеш пароля
    minlength: 10, // минимальная длина — 10 символов
    validate: {
      validator(v) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/.test(v);
      },
      message: (props) => `${props.value} is not valid password. Please include at least 1 uppercase character, 1 lowercase character, and 1 number.`,
    },
  },

  name: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // максимальная длина - 30 символов
  },

});

// метод проверки почты и пароля
// принимает на вход два параметра — почту и пароль, — и возвращает объект пользователя или ошибку.
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
