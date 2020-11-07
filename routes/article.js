const articlesRouter = require('express').Router();
const { getAllArticles } = require('../controllers/article');
const { postArticles } = require('../controllers/article');
const { deleteArticles } = require('../controllers/article');
const { validatePostArticles } = require('../middlewares/validateJoi');
const { validatedeleteArticles } = require('../middlewares/validateJoi');

// возвращает все сохранённые пользователем статьи
articlesRouter.get('/', getAllArticles);

// создаёт статью с переданными в теле keyword, title, text, date, source, link и image
articlesRouter.post('/', validatePostArticles, postArticles);

// удаляет сохранённую статью  по _id
articlesRouter.delete('/:articleId', validatedeleteArticles, deleteArticles);

module.exports = articlesRouter;
