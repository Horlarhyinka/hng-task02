import Joi from "joi";


class OrgValidator{
    validateCreateOrgPayload(obj: object){
        return Joi.object({
            name: Joi.string().required(),
            description: Joi.string()
        }).validate(obj)
    }
}

const orgValidator = new OrgValidator()

export default orgValidator