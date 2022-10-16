const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const secretKey = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret-code';

  const token = req.cookies.access_token;
  if (!token) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload; // добавляем пейлоуд токена в объект запроса
  next(); // отправляем запрос дальше
};

module.exports = { auth };
