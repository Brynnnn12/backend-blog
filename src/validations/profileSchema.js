const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  currentPassword: Joi.string().min(6).when("newPassword", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  newPassword: Joi.string().min(6).optional(),
});
