const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const STATUS_CODE = require('../errors/statusCode');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');

const getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для поиска'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      };
      res.send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret-code', { expiresIn: '7d' });
      res
        .cookie('access_token', token, {
          maxAge: 604800000,
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .send({ message: 'Аутентификация прошла успешно' });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about, _id = req.user._id } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar, _id = req.user._id } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      next(new NotFound('Пользователь не найден'));
    } else {
      res.status(STATUS_CODE.success).send(user);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы некорректные данные для поиска'));
    } else {
      next(err);
    }
  });

module.exports = {
  getUser, getUserById, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
