import { expect } from "chai";
// import { start } from "../../src/server";
import request, { Response } from "supertest";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
// import { Server, IncomingMessage, ServerResponse } from "http";

describe("Test backend server api", () => {
//   let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  dotenv.config({ path: "../.env" }); //load the global .env at root directory
  const SERVER_URL = `http://localhost:${process.env.SERVER_PORT}`;
  const INVALID_QUERY = {
    deptList: ["adhe"],
    levelList: [300],
    yearStart: 19000,
    yearEnd: 2016,
  };
  const VALID_QUERY = {
    "deptList": ["cpsc", "adhe"],
    "levelList": [100, 300],
    "yearStart": 2007,
    "yearEnd": 2016
  }
  
  const VALID_RESULT = [
    {
        "dept": "adhe",
        "id": 327,
        "average": "83.05"
    },
    {
        "dept": "adhe",
        "id": 328,
        "average": "80.65"
    },
    {
        "dept": "adhe",
        "id": 329,
        "average": "82.90"
    },
    {
        "dept": "adhe",
        "id": 330,
        "average": "85.25"
    },
    {
        "dept": "cpsc",
        "id": 110,
        "average": "74.41"
    },
    {
        "dept": "cpsc",
        "id": 121,
        "average": "75.54"
    },
    {
        "dept": "cpsc",
        "id": 301,
        "average": "81.84"
    },
    {
        "dept": "cpsc",
        "id": 302,
        "average": "75.51"
    },
    {
        "dept": "cpsc",
        "id": 303,
        "average": "72.76"
    },
    {
        "dept": "cpsc",
        "id": 304,
        "average": "76.30"
    },
    {
        "dept": "cpsc",
        "id": 310,
        "average": "78.25"
    },
    {
        "dept": "cpsc",
        "id": 311,
        "average": "77.25"
    },
    {
        "dept": "cpsc",
        "id": 312,
        "average": "80.71"
    },
    {
        "dept": "cpsc",
        "id": 313,
        "average": "73.98"
    },
    {
        "dept": "cpsc",
        "id": 314,
        "average": "76.78"
    },
    {
        "dept": "cpsc",
        "id": 317,
        "average": "72.57"
    },
    {
        "dept": "cpsc",
        "id": 319,
        "average": "84.52"
    },
    {
        "dept": "cpsc",
        "id": 320,
        "average": "70.09"
    },
    {
        "dept": "cpsc",
        "id": 322,
        "average": "73.11"
    },
    {
        "dept": "cpsc",
        "id": 340,
        "average": "75.69"
    },
    {
        "dept": "cpsc",
        "id": 344,
        "average": "78.47"
    }
]

/*
// There are bugs that cause server to start multiple times.
// For now, manually start the server before testing...
  before(() => {
    console.log("Starting server before tests...");
    server = start();
  });

  after(function () {
    if (server) {
        console.log("Stopping server after tests...");
        server.close();
    }
  });
*/

  beforeEach(function () {
    console.log("Starting a test...");
  });

  afterEach(function () {
    console.log("Finished a test...");
  });

  it("POST test for an invalid query", async function () {    
    return request(SERVER_URL)
      .post(`/api/v1/query/average`)
      .send(INVALID_QUERY)
      .set("Content-Type", "application/json")
      .then(function (res: Response) {
        console.log(`POST Response: ${res.status}`);
        expect(res.status).to.be.equal(StatusCodes.BAD_REQUEST);
        //expect(res.body.error).to.exist;
      })
      .catch(function (err) {
        console.log(err);
        expect.fail();
      });
  });

  it("POST test for a valid query", async function () {    
    return request(SERVER_URL)
      .post(`/api/v1/query/average`)
      .send(VALID_QUERY)
      .set("Content-Type", "application/json")
      .then(function (res: Response) {
        console.log(`POST Response: ${res.status}`);
        expect(res.status).to.be.equal(StatusCodes.OK);
        expect(res.body.result).to.deep.equal(VALID_RESULT);
        //expect(res.body.error).to.exist;
      })
      .catch(function (err) {
        console.log(err);
        expect.fail();
      });
  });
});
