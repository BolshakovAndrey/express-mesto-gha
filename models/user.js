const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: [true, 'Укажите информацию о себе'],
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'Добавьте аватар'],
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);