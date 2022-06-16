require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
// validation
const { validateSignup, validateSignin } = require('./middlewares/validators');
const { NotFoundError } = require('./errors/index-err');

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

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

// обработчик ошибок celebrate
app.use(errors());

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});