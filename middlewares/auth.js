const jwt = require('jsonwebtoken');
const StatusCodes = require('../utils/utils');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: 'Переданы некорректные данные для авторизации пользователя' });
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: 'Переданы некорректные данные для авторизации пользователя' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};