import { status as healthStatus } from "../service/healthcheckService.js";

function status() {
    return healthStatus()
}

export {status}