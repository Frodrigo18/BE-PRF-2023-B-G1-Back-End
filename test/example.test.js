import { expect } from 'chai';
import sinon from 'sinon';
import { user } from './stub/userStub.js'
import { request } from './stub/requestStub.js';
import * as requestService from '../service/requestService.js'
import * as stationService from '../service/stationService.js';
import { stationAlreadyExistsError } from './stub/stationStub.js';

describe("RequestService Test Suite", () => {
  beforeEach(() => {
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Add Requests but station already exists", async () => {
    const resultOutput = stationAlreadyExistsError(request.serial_number);

    sinon.stub(stationService, "exists").resolves(true);
    sinon.stub(requestService, "exists").resolves(false);

    try{
      await requestService.add(user, request);
    }catch (error){
      expect(error).to.equal(resultOutput);
    }

  });
});