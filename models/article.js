const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({

  // ключевое слово, по которому ищутся статьи.
  keyword: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
  },

  // заголовок статьи
  title: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
  },

  // текст статьи
  text: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
  },

  // дата статьи
  date: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
  },

  // источник статьи
  source: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
  },

  // ссылка на статью.
  link: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    validate: { // валидация URL
      validator(v) {
        return validator.isURL(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },

  // ссылка на иллюстрацию к статье
  image: {
    type: String, // тип данныйх - строка
    required: true, // поле обязательно для заполнения
    validate: { // валидация URL
      validator(v) {
        return validator.isURL(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },

  // _id пользователя
  owner: {
    type: mongoose.Schema.Types.ObjectId, // тип - ObjectId
    ref: 'user', // ссылка на модель автора карточки,
    required: true, // обязательное поле
    select: false, // свойство чтобы API не возвращал _id пользователя
  },

});

module.exports = mongoose.model('article', articleSchema);
