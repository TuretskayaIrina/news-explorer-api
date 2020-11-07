const router = require('express').Router();
const { login } = require('../controllers/user');
const { createUser } = require('../controllers/user');
const usersRouter = require('./user');
const articlesRouter = require('./article');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { validateSignin } = require('../middlewares/validateJoi');
const { validateSignup } = require('../middlewares/validateJoi');

// проверяет переданные в теле почту и пароль
router.post('/signin', validateSignin, login);

// создаёт пользователя с переданными в теле email, password и name
router.post('/signup', validateSignup, createUser);

router.use(auth); // защищаем все ниже перечисленные роуты авторизацией

router.use('/users', usersRouter);
router.use('/articles', articlesRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
});

module.exports = router;
