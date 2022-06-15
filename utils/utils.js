// Status codes
module.exports = {
  CREATED: 201,
  BAD_REQUEST: 400, // переданы некорректные данные
  UNAUTHORIZED: 401, // ошибка авторизации
  NOT_FOUND: 404, // карточка или пользователь не найден.
  SERVER_ERROR: 500, // ошибка сервера по-умолчанию.
};
