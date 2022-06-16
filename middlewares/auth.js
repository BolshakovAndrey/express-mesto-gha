const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/index-err');
const StatusMessages = require('../utils/status-messages');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new NotFoundError(StatusMessages.UNAUTHORIZED);
  }
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new NotFoundError(StatusMessages.UNAUTHORIZED);
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};