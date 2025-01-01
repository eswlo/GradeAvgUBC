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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepts = getDepts;
exports.getYears = getYears;
exports.getAvgHistByCourse = getAvgHistByCourse;
exports.getAvgs = getAvgs;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../db");
function getDepts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT DISTINCT dept FROM sections ORDER BY dept;`;
            const result = yield db_1.pool.query(query);
            res.status(http_status_codes_1.StatusCodes.OK).json({ result: result.rows });
        }
        catch (err) {
            console.log("Error occurred in getDepts method:", { err });
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err });
        }
    });
}
function getYears(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = `SELECT DISTINCT year FROM sections ORDER BY year ASC;`;
            const result = yield db_1.pool.query(query);
            res.status(http_status_codes_1.StatusCodes.OK).json({ result: result.rows });
        }
        catch (err) {
            console.log("Error occurred in getYears method:", { err });
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err });
        }
    });
}
function getAvgHistByCourse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dept, id, title } = req.params;
        try {
            const query = `
    SELECT dept, id, year, title, ROUND(AVG(avg), 2) AS average
    FROM ${process.env.PGTABLE_SECTIONS}
    WHERE dept = $1 AND id = $2 AND title = $3
    GROUP BY dept, id, year, title
    ORDER BY year ASC;
`;
            const result = yield db_1.pool.query(query, [dept, Number(id), title]);
            res.status(http_status_codes_1.StatusCodes.OK).json({ result: result.rows });
        }
        catch (err) {
            console.log("Error occurred in getAvgByCourse method:", { err });
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err });
        }
    });
}
function getAvgs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deptList, levelList, yearStart, yearEnd, avgLowerBound, avgHigherBound, } = req.body;
        try {
            if (!deptList || deptList.length === 0) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: "Please provide at least one department." });
                return;
            }
            if (!levelList || levelList.length === 0) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: "Please provide at least one course level." });
                return;
            }
            if (avgLowerBound > avgHigherBound) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: "Average lower bound is larger than higher bound." });
                return;
            }
            if (yearStart > yearEnd) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "Wrong year range." });
                return;
            }
            const levelConditions = levelList
                .map((level) => {
                const startRange = level;
                const endRange = level + 100;
                return `(id >= ${startRange} AND id < ${endRange})`;
            })
                .join(" OR ");
            const query = `
            SELECT dept, id, title, ROUND(AVG(avg), 2) AS average
            FROM ${process.env.PGTABLE_SECTIONS}
            WHERE dept = ANY($1)
                AND (
                    (year BETWEEN $2 AND $3)
                    OR year = $4
                )
                AND (${levelConditions})   
            GROUP BY dept, id, title
            ORDER BY average DESC, dept DESC, id DESC, title DESC;
        `;
            const result = yield db_1.pool.query(query, [
                deptList,
                yearStart,
                yearEnd,
                process.env.PGOVERALL_YEAR,
            ]);
            const filteredResult = result.rows.filter((row) => row.average >= avgLowerBound && row.average <= avgHigherBound);
            res.status(http_status_codes_1.StatusCodes.OK).json({ result: filteredResult });
        }
        catch (err) {
            console.log("Error occurred during pool query:", { err });
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err });
        }
    });
}
//# sourceMappingURL=grades.js.map