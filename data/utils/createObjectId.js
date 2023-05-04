import { ObjectId } from 'bson';
import { InvalidUserIdError } from './error/InvalidUserIdError.js';

function createObjectId(id){
    try{
        const objectId = new ObjectId(id)
        return objectId
      }
      catch (error){
        throw new InvalidUserIdError(`Invalid format for user id ${id}: ${error.message}`)
      }
}

export {createObjectId}