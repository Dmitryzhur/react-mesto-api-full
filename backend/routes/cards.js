const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { httpRegex } = require('../utils/constants');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCard);

cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(httpRegex),
  }),
}), createCard);

cardRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

cardRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

cardRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = cardRouter;
