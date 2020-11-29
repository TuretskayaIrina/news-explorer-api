const { celebrate, Joi } = require('celebrate');
const { CelebrateError } = require('celebrate');
const validator = require('validator');

// валидация URL
const validatorLink = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('invalid URL');
  }
  return value;
};

// валидация аунтификации
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" должно быть валидным!')
      .messages({
        'any.required': 'Поле "email" обязательно для заполнения!',
      }),
    password: Joi.string().required().min(10)
      .messages({
        'any.required': 'Поле "password" обязательно для заполнения!',
        'string.min': 'Минимальная длина поля "password" 10 символов!',
      }),
  }),
});

// валидация регистрации
const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле "email" должно быть валидным!')
      .messages({
        'any.required': 'Поле "email" обязательно для заполнения!',
      }),
    password: Joi.string().min(10).required().pattern(/^\S+$/)
      .message('Пороль должен быть без')
      .messages({
        'any.required': 'Поле "password" обязательно для заполнения!',
        'string.min': 'Минимальная длина поля "password" 10 символов!',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Поле "name" обязательно для заполнения!',
        'string.min': 'Минимальная длина поля "name" 2 символа!',
        'string.max': 'Минимальная длина поля "name" 30 символов!',
      }),
  }),
});

// валидация создания статьи
const validatePostArticles = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required()
      .messages({
        'any.required': 'Поле "keyword" обязательно для заполнения!',
      }),
    title: Joi.string().required()
      .messages({
        'any.required': 'Поле "title" обязательно для заполнения!',
      }),
    text: Joi.string().required()
      .messages({
        'any.required': 'Поле "text" обязательно для заполнения!',
      }),
    date: Joi.string().required()
      .messages({
        'any.required': 'Поле "date" обязательно для заполнения!',
      }),
    source: Joi.string().required()
      .messages({
        'any.required': 'Поле "source" обязательно для заполнения!',
      }),
    link: Joi.string().custom(validatorLink).required()
      .messages({
        'any.required': 'Поле "link" обязательно для заполнения!',
      }),
    image: Joi.string().custom(validatorLink).required()
      .messages({
        'any.required': 'Поле "image" обязательно для заполнения!',
      }),
  }),
});

// валидация удаления статьи
const validatedeleteArticles = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateSignin,
  validateSignup,
  validatePostArticles,
  validatedeleteArticles,
};
