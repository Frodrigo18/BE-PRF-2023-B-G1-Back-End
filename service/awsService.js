import dotenv from "dotenv";
import fetch from "node-fetch";
import { AwsUnexpectedError } from "./error/awsUnexpectedError.js";
import { AwsRequestError } from "./error/awsRequestError.js";

dotenv.config();

const AWS_HOST = process.env.AWS_STF_HOST

async function alterAwsThing(station) {
    console.log(`INFO: Altering AWS Thing`);
    const response = await _createAwsThing(station);
    console.log(`INFO: Altering AWS Thing finished successfully`);
    return response;
}

async function createAwsIoT(request) {
    console.log(`INFO: Creating AWS IoT`);
    await _createAwsThing(request);
    await _createAwsEntity(request);
    console.log(`INFO: Creating AWS IoT finished successfuly`);
}

async function _createAwsThing(thing) {
    const url = `${AWS_HOST}/iot/things`;
    const body = {
        id: `urn:ngsi-ld:Device:${thing.name}`,
        type: "Device",
        thingGroups: {
            type: "Property",
            value: [
                "LoRaWAN"
            ]
        },
        location: {
            type: "GeoProperty",
            value: {
                type: "Point",
                coordinates: [
                    thing.longitud,
                    thing.latitude
                ]
            }
        }
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    };

    return await _awsRequest(url, options)
}

async function _createAwsEntity(entity) {
    const url = `${AWS_HOST}/ngsi-ld/v1/entities`;
    const body = {
        id: `urn:ngsi-ld:Device:${entity.name}`,
        type: "Device",
        serialNumber: {
            type: "Property",
            value: entity.serial_number
        }
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    };

    return await _awsRequest(url, options)
}

async function suspendAwsThing(station) {
    console.log(`INFO: Sending request to AWS to suspend Station Id ${station._id}`)
    const url = `${AWS_HOST}/iot/things/${station.name}`;
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };
    console.log(`INFO: Sending request to AWS to suspend Station Id ${station._id} finished successfully`)
    return await _awsRequest(url, options)
}

async function _awsRequest(url, options) {
    try {
        const awsResponse = await fetch(url, options);
        const awsJson = await awsResponse.json();

        switch (awsResponse.status) {
            case 200:
                return awsJson;
            default:
                console.log(`ERROR: An unexpected error occured while making request to AWS. \n Error: ${JSON.stringify(awsJson)}`);
                throw new AwsUnexpectedError();
        }
    }
    catch (error) {
        if (error instanceof AwsUnexpectedError) {
            throw error;
        }
        else {
            console.log(`ERROR: Failed to make request to AWS. \n Error: ${error}`);
            throw new AwsRequestError();
        }
    }
}

export { suspendAwsThing, createAwsIoT, alterAwsThing };