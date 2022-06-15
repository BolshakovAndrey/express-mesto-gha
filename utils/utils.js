// Status codes
module.exports = {
  SUCCESS: 200, // успешно выполнено
  CREATED: 201, // создано успешно
  BAD_REQUEST: 400, // переданы некорректные данные
  UNAUTHORIZED: 401, // ошибка авторизации
  NOT_FOUND: 404, // карточка или пользователь не найден.
  SERVER_ERROR: 500, // ошибка сервера по-умолчанию.
};
