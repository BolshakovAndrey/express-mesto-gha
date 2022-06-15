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
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные при авторизации пользователя, нужны email и пароль' });
    return;
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
        .end();
    })
    .catch((err) => {
      res.status(StatusCodes.UNAUTHORIZED).send({ message: err.message });
    });
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
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные при создании пользователя, нужны email и пароль' });
    return;
  }

  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    // записываем хеш в базу
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })

      .then((user) => res.status(StatusCodes.CREATED).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(StatusCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя ${err.message}` });
          return;
        }
        res.status(StatusCodes.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }));
};

// обновляет профиль
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении профиля ${err.message}` });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: `Переданы некорректные данные при обновлении аватара ${err.message}` });
        return;
      }
      res.status(StatusCodes.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};