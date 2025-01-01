"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
describe("Test backend server api", () => {
    dotenv_1.default.config({ path: "../.env" });
    const SERVER_URL = `http://localhost:${process.env.SERVER_PORT}`;
    const INVALID_QUERY = {
        deptList: ["adhe"],
        levelList: [300],
        avgLowerBound: 80,
        avgHigherBound: 85,
        yearStart: 19000,
        yearEnd: 2016,
    };
    const VALID_QUERY = {
        deptList: ["cpsc", "adhe"],
        levelList: [100, 300],
        avgLowerBound: 80,
        avgHigherBound: 85,
        yearStart: 2007,
        yearEnd: 2016,
    };
    const VALID_RESULT = [
        {
            dept: "adhe",
            id: 327,
            average: "83.05",
        },
        {
            dept: "adhe",
            id: 328,
            average: "80.65",
        },
        {
            dept: "adhe",
            id: 329,
            average: "82.90",
        },
        {
            dept: "cpsc",
            id: 301,
            average: "81.84",
        },
        {
            dept: "cpsc",
            id: 312,
            average: "80.71",
        },
        {
            dept: "cpsc",
            id: 319,
            average: "84.52",
        },
    ];
    beforeEach(function () {
        console.log("Starting a test...");
    });
    afterEach(function () {
        console.log("Finished a test...");
    });
    it("GET test for retrieving list of departments", function () {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, supertest_1.default)(SERVER_URL)
                .get(`/api/v1/grades/departments`)
                .then(function (res) {
                console.log(`GET Response: ${res.status}`);
                (0, chai_1.expect)(res.status).to.be.equal(http_status_codes_1.StatusCodes.OK);
                (0, chai_1.expect)(res.body.result).to.be.an("array");
                (0, chai_1.expect)(res.body.result).to.deep.include({ dept: "cpsc" });
            })
                .catch(function (err) {
                console.log(err);
                chai_1.expect.fail();
            });
        });
    });
    it("POST test for an invalid query", function () {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, supertest_1.default)(SERVER_URL)
                .post(`/api/v1/grades/averages`)
                .send(INVALID_QUERY)
                .set("Content-Type", "application/json")
                .then(function (res) {
                console.log(`POST Response: ${res.status}`);
                (0, chai_1.expect)(res.status).to.be.equal(http_status_codes_1.StatusCodes.BAD_REQUEST);
            })
                .catch(function (err) {
                console.log(err);
                chai_1.expect.fail();
            });
        });
    });
    it("POST test for a valid query", function () {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, supertest_1.default)(SERVER_URL)
                .post(`/api/v1/grades/averages`)
                .send(VALID_QUERY)
                .set("Content-Type", "application/json")
                .then(function (res) {
                console.log(`POST Response: ${res.status}`);
                (0, chai_1.expect)(res.status).to.be.equal(http_status_codes_1.StatusCodes.OK);
                (0, chai_1.expect)(res.body.result).to.deep.equal(VALID_RESULT);
            })
                .catch(function (err) {
                console.log(err);
                chai_1.expect.fail();
            });
        });
    });
});
//# sourceMappingURL=app.spec.js.map