import { bodyValidation } from './bodyValidator.js';

function addRequestValidator(req, res, next) {
    const rules = {
        serial_number: 'required|string',
        name: 'required|string',
        longitud: 'required|number',
        latitude: 'required|number',
        brand: 'required|string',
        model: 'required|string'
    };
    bodyValidation(req, res, next, rules);
  }

export {addRequestValidator};