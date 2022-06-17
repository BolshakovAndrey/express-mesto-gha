const jwt = require('jsonwebtoken');

const { NotFoundError } = require('../errors/index-err');
const StatusMessages = require('../utils/status-messages');
const { JWT_SECRET } = require('../utils/constants');
const StatusCodes = require('../utils/status-codes');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: StatusMessages.UNAUTHORIZED });
  }

  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new NotFoundError(StatusMessages.UNAUTHORIZED);
  }
  req.user = payload; // записываем пейлоад в объект запроса

  next(); // пропускаем запрос дальше
};