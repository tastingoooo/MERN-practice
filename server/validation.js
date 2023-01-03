const joi = require("joi");

//Register validation
const registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().min(6).max(50).required().email(),
    password: joi.string().min(6).max(255).required(),
    role: joi.string().required().valid("student", "instructor"),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(3).max(50).required().email(),
    password: joi.string().min(3).max(255).required(),
  });
  return schema.validate(data);
};

const coureseValidation = (data) => {
  const schema = joi.object({
    title: joi.string().min(6).max(50).required(),
    description: joi.string().min(6).max(50).required(),
    price: joi.number().min(10).max(9999).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.coureseValidation = coureseValidation;
