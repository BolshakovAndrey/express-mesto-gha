const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});


// подключаем мидлвары, роуты и всё остальное...
app.use((req, res, next) => {
  req.user = {
    _id: '629fb6ffe0b35126d32f9087' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
  console.log(BASE_PATH);
})