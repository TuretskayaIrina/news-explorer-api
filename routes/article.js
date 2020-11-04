const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllArticles } = require('../controllers/article');
const { postArticles } = require('../controllers/article');
const { deleteArticles } = require('../controllers/article');

// возвращает все сохранённые пользователем статьи
articlesRouter.get('/', getAllArticles);

// создаёт статью с переданными в теле keyword, title, text, date, source, link и image
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
    image: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
  }),
}), postArticles);

// удаляет сохранённую статью  по _id
articlesRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticles);

module.exports = articlesRouter;
