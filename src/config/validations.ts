
import Joi from "joi";

const userUpdateSchema = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    phone: Joi.string().max(16).required(),
    password: Joi.string().max(50).required(),
    birthday: Joi.date().required(),
});
const loginSchema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().max(50).required(),

});


export { userUpdateSchema, loginSchema }