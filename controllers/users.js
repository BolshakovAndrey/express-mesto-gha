const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// errors
const ErrorTypes = require('../utils/error-types');
const StatusCodes = require('../utils/status-codes');
const StatusMessages = require('../utils/status-messages');
const {
  BadRequestError, UnauthorizedError, NotFoundError, ConflictError,
} = require('../errors/index-err');

// const { NODE_ENV, JWT_SECRET } = process.env;

// аутентификация пользователей и создание JWT токена
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(StatusMessages.BAD_REQUEST);
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key', // NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через 1 неделю после создания
      );
      // вернём токен
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      })
        .send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(`${err.message}`);
    })
    .catch(next);
};

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// возвращает информацию о текущем пользователе
module.exports.currentUserInfo = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(StatusMessages.NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        throw new BadRequestError(StatusMessages.INVALID_ID);
      }
      next(err);
    })
    .catch(next);
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(StatusMessages.NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        throw new BadRequestError(StatusMessages.INVALID_ID);
      }
      next(err);
    })
    .catch(next);
};

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError(StatusMessages.BAD_REQUEST);
  }
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res
          .status(StatusCodes.CREATED)
          .send(user))
        .catch((err) => {
          if (err.name === 'ErrorTypes.BASE_ERROR && err.code === StatusCodes.BASE_ERROR') {
            throw new ConflictError(StatusCodes.CONFLICT);
          }
          if (err.name === ErrorTypes.VALIDATION) {
            throw new BadRequestError(`Переданы некорректные данные при создании пользователя: ${err}`);
          }
          next(err);
        })
        .catch(next);
    });
};

// обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(StatusMessages.NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        throw new BadRequestError(StatusMessages.INVALID_ID);
      }
      if (err.name === ErrorTypes.VALIDATION) {
        throw new BadRequestError(`Переданы некорректные данные при обновлении профиля: ${err.message}`);
      }
      next(err);
    })
    .catch(next);
};

// обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(StatusMessages.NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        throw new BadRequestError(StatusMessages.INVALID_ID);
      }
      if (err.name === ErrorTypes.VALIDATION) {
        throw new BadRequestError(`Переданы некорректные данные при обновлении аватара: ${err.message}`);
      }
      next(err);
    })
    .catch(next);
};