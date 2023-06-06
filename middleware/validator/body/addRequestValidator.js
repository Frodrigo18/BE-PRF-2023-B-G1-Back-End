import {bodyValidation} from './bodyValidation.js';

function addRequestValidator(req, res, next) {
    const rules = {
        serial_number: 'required|string',
        name: 'required|string',
        longitude: 'required',
        latitude: 'required',
        brand: 'required|string',
        model: 'required|string'
    };
    bodyValidation(req, res, next, rules);
  }

export {addRequestValidator};