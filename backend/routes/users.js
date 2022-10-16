const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { httpRegex } = require('../utils/constants');

const {
  getUser, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUser);

userRouter.get('/users/me', getCurrentUser);

userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(httpRegex),
  }),
}), updateAvatar);

module.exports = userRouter;
