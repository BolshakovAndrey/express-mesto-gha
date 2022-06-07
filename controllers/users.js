const User = require('../models/user');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

// обновляет профиль
module.exports.updateProfile = (req, res) => {
  const {name, about} = req.body;

  User.findByIdAndUpdate(req.params._id, {name, about}, {new: true, runValidators: true})
    .then((user) => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
}

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;

  User.findByIdAndUpdate(req.params._id, {avatar}, {new: true, runValidators: true})
    .then((user) => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
}
