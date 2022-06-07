const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: 'string',
    required: true,
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);