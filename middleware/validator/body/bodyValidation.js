import { make } from 'simple-body-validator';

function bodyValidation(req, res, next, rules){
    const bodyKeys = Object.keys(req.body)
    const invalidKeys = bodyKeys.filter(key => !Object.keys(rules).includes(key));
    const validator = make(req.body, rules);
    const errorMessage = {};

    if (!validator.validate()) {
        errorMessage.invalidFormat = validator.errors().all();
    }
    if (invalidKeys.length){
        errorMessage.invalidKeys = `Invalid Key: ${invalidKeys.toString()}`;
    }
    if(Object.keys(errorMessage).length){
        res.status(400).send({error: errorMessage});
    }
    else{
        next();
    }
}

export {bodyValidation};