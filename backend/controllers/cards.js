const Card = require('../models/card');
const STATUS_CODE = require('../errors/statusCode');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

const getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
			err.name === 'ValidationError' // eslint-disable-line
        ? next(new BadRequest('Переданы некорректные данные при создании карточки'))
        : next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw next(new Forbidden('Данную карточку удалить нельзя. Недостаточно прав.'));
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(STATUS_CODE.success).send({ message: 'Карточка удалена' }))
        .catch((err) => {
					err.name === 'CastError' // eslint-disable-line
            ? next(new BadRequest('Переданы некорректные данные для удаления карточки'))
            : next(err);
        });
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
			!card // eslint-disable-line
        ? next(new NotFound('Карточка не найдена'))
        : res.send(card);
    })
    .catch((err) => {
			err.name === 'CastError' // eslint-disable-line
        ? next(new BadRequest('Переданы некорректные данные для постановки лайка'))
        : next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
			!card // eslint-disable-line
        ? next(new NotFound('Карточка не найдена'))
        : res.send(card);
    })
    .catch((err) => {
			err.name === 'CastError' // eslint-disable-line
        ? next(new BadRequest('Переданы некорректные данные для снятия лайка'))
        : next(err);
    });
};

module.exports = {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
};
