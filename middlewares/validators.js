/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/ht{2}ps?:\/\/(w{3})?[\-\.~:\/\?#\[\]@!$&'\,;=\w]+#?\b/),
  }),
});

const validateCardCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/ht{2}ps?:\/\/(w{3})?[\-\.~:\/\?#\[\]@!$&'\,;=\w]+#?\b/),

  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateProfileUpdate,
  validateAvatarUpdate,
  validateCardCreation,
};