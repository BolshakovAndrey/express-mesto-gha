require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const StatusCodes = require('./utils/utils');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();

// подключаем мидлвары
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use((req, res, next) => {
  req.user = {
    _id: '629fb6ffe0b35126d32f9087', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

// роуты, не требующие авторизации,
app.post('/signin', login);
app.post('/signup', createUser);

// защитим API авторизацией
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});