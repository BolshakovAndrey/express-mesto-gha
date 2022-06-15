const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле имя должно быть заполнено'],
    minLength: [2, 'Минимальное количество букв в имени - 2'],
    maxLength: [30, 'Минимальное количество букв в имени - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Укажите информацию о себе'],
    minLength: [2, 'Минимальное количество букв в описании - 2'],
    maxLength: [30, 'Минимальное количество букв в описании - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Добавьте аватар'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Поле email  должно быть заполнено'],
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: [true, 'Поле пароль должно быть заполнено'],
    // TODO исключить пароль из ответа сервера
    // Но в случае аутентификации хеш пароля нужен.
    // Чтобы это реализовать, после вызова метода модели,
    // нужно добавить вызов метода select, передав ему строку +password:
    select: false, // необходимо добавить поле select
  },
});

userSchema.statics.findUserByCredentials = (email, password) => this.findOne({ email })
  .then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
  });

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);