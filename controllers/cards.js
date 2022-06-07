const Card = require('../models/card');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка'}));
};

// создаёт карточку
module.exports.createCard= (req, res) => {
  const { name, link} = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner})
    .then(card => res.send({data:card}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка'}));
}

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => res.send({data: card}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка'}));
};

// ставит лайк карточке
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)