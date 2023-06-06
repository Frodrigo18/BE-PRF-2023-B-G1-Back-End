import {bodyValidation} from './bodyValidation.js';

function renameStationValidator(req, res, next) {
    const rules = {
        name: 'required|string',
    };
    bodyValidation(req, res, next, rules);
  }

export {renameStationValidator};