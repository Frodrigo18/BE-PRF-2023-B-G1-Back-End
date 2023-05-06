import {bodyValidation} from './bodyValidation.js';

//TODO validate number
function addRequestValidator(req, res, next) {
    const rules = {
        serial_number: 'required|string',
        name: 'required|string',
        longitud: 'required',
        latitude: 'required',
        brand: 'required|string',
        model: 'required|string'
    };
    bodyValidation(req, res, next, rules);
  }

export {addRequestValidator};