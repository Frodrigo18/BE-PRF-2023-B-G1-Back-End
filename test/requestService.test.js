import Sinon from "sinon";
import { add } from "../service/requestService.js";
import { exists as existRequest } from "../service/requestService.js";
import { exists as existsStation } from "../service/stationService.js";
import { getConnection } from "../data/connection/conn.js";



describe("Add Request", () => {

    let getConnectionStub; // Variable para el stub de conn.js

    beforeAll(() => {
        // Crea un stub para conn.js
        getConnectionStub = sinon.stub(getConnection, "MongoClient");
    });

    afterAll(() => {
        // Restaura el comportamiento original de conn.js después de las pruebas
        getConnectionStub.restore();
    });
    it('should test my function', () => {
        console.log("Hola");
    });
});
