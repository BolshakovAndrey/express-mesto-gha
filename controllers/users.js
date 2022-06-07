const User = require('../models/users');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка'}));
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка'}));
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};
