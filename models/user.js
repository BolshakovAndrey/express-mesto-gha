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
    validate: {
      validator(val) {
        // eslint-disable-next-line no-useless-escape
        return /ht{2}ps?:\/\/(w{3})?[\-\.~:\/\?#\[\]@!$&'\,;=\w]+#?\b/gi.test(val);
      },
    },
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
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = (email, password) => this.findOne({ email }).select('+password')
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

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);