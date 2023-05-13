import {bodyValidation} from './bodyValidation.js';

function rejectRequestValidator(req, res, next) {
    const rules = {
        reason: 'required|string',
    };
    bodyValidation(req, res, next, rules);
  }

export {rejectRequestValidator};