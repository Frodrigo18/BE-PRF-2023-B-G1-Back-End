import { make } from 'simple-body-validator';

function bodyValidation(req, res, next, rules){
    const bodyKeys = Object.keys(req.body)
    const invalidKeys = bodyKeys.filter(key => !Object.keys(rules).includes(key));
    const validator = make(req.body, rules);
    const errorMessage = {};

    const longitude = req.body.longitude;
    const latitude = req.body.latitude;

    if (longitude && latitude){
        if (isNaN(longitude)) {
            errorMessage.invalidFormat = "Longitude must be numeric"
        }
        else if (longitude < -180 || longitude > 180) {
            errorMessage.invalidFormat = "Longitude is out of range. Must be between -180 and 180"
        }
        if (isNaN(latitude)){
            errorMessage.invalidFormat = "Latitude must be numeric"
        }
        else if (latitude < -90 || latitude > 90) {
            errorMessage.invalidFormat = "Longitud is out of range. Must be between -90 and 90"
        }
    }

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