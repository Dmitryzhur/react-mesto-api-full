const routes = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateUserBody, validateAuthentication } = require('../middlewares/validations');
const NotFound = require('../errors/NotFound');

routes.post('/signup', validateUserBody, createUser);
routes.post('/signin', validateAuthentication, login);

routes.use(auth);
routes.use('/', userRouter);
routes.use('/', cardRouter);
routes.get('/logout', (req, res) => {
  res.clearCookie('access_token').send({ message: 'Выход' });
});
routes.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = routes;
