const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validatorLink } = require('../middlewares/validate');
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
    link: Joi.string().custom(validatorLink).required(),
    image: Joi.string().custom(validatorLink).required(),
  }),
}), postArticles);

// удаляет сохранённую статью  по _id
articlesRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().hex(),
  }),
}), deleteArticles);

module.exports = articlesRouter;
