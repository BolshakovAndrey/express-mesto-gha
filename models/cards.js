const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: 'string',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: []
  },
  createAtt: {
    type: Date,
    default: Date.now()
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);