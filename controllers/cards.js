const Card = require('../models/card');
// errors
const ErrorTypes = require('../utils/error-types');
const StatusCodes = require('../utils/status-codes');
const StatusMessages = require('../utils/status-messages');
const {
  NotFoundError, BadRequestError,
} = require('../errors/index-err');

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res
      .status(StatusCodes.CREATED)
      .send(card))
    .catch((err) => {
      if (err.name === ErrorTypes.VALIDATION) {
        throw new BadRequestError(`Переданы некорректные данные при создании карточки: ${err}`);
      }
      next(err);
    })
    .catch(next);
};

// удаляет карточку по _id
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(StatusMessages.NOT_FOUND);
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        res
          .status(StatusCodes.FORBIDDEN)
          .send({ message: StatusMessages.FORBIDDEN });
      } else {
        Card.deleteOne(card)
          .then(() => res
            .status(StatusCodes.SUCCESS)
            .send({ message: StatusMessages.SUCCESS }));
      }
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: StatusMessages.INVALID_ID });
        return;
      }
      next(err);
    })
    .catch(next);
};

// ставит лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(StatusMessages.NOT_FOUND);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: StatusMessages.INVALID_ID });
        return;
      }
      next(err);
    })
    .catch(next);
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(StatusMessages.NOT_FOUND);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: StatusMessages.INVALID_ID });
        return;
      }
      next(err);
    })
    .catch(next);
};