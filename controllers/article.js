const Articles = require('../models/article');
const ValidationError = require('../errors/Validation-error');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');

// вернуть все статьи
const getAllArticles = (req, res, next) => Articles.find({})
  .then((cards) => {
    res.send((cards));
  })
  .catch(next);

// создать статью с переданными в теле keyword, title, text, date, source, link и image
const postArticles = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  const { _id: userId } = req.user;
  Articles.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: userId,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации. Некорректные данные.');
      }
      next(err);
    });
};

// удалить статью
const deleteArticles = (req, res, next) => {
  Articles.findById(req.params.articleId).select('+owner')
    .orFail(new NotFoundError(`Статья с id ${req.params.articleId} не существует`))

    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав');
      }

      article.remove()
        .then(() => res.status(200).send({ message: 'Статья удалена' }));
    })

    .catch(next);
};

module.exports = {
  getAllArticles,
  postArticles,
  deleteArticles,
};
