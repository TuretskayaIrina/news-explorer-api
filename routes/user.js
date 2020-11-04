const usersRouter = require('express').Router();
const { getUser } = require('../controllers/user');

// вернуть информацию о пользователе (email и имя)
usersRouter.get('/me', getUser);

module.exports = usersRouter;
