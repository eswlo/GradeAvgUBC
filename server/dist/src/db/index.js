"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectionString = process.env.NODE_ENV === "development"
    ? `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`
    : process.env.PGRENDERURL;
console.log(connectionString);
exports.pool = new pg_1.Pool({
    connectionString: connectionString,
    max: 5,
    idleTimeoutMillis: 300000,
});
//# sourceMappingURL=index.js.map