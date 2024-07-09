import Joi from "joi";

class AuthValidator{
    validateRegisterPayload(obj: object){
        return Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            phone: Joi.string()
        }).validate(obj)
    }

    
}

const authValidator = new AuthValidator()
export default Object.freeze(authValidator)