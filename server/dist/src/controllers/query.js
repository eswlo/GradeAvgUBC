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
exports.getAvg = getAvg;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../db");
function getAvg(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deptList, levelList, yearStart, yearEnd } = req.body;
        try {
            if (!deptList || deptList.length === 0) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: "Provide at least one department." });
                return;
            }
            if (!levelList || levelList.length === 0) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ error: "Provide at least one course level." });
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
            SELECT dept, id, ROUND(AVG(avg), 2) AS average
            FROM ${process.env.PGTABLE_SECTIONS}
            WHERE dept = ANY($1)
                AND (
                    (year BETWEEN $2 AND $3)
                    OR year = $4
                )
                AND (${levelConditions})   
            GROUP BY dept, id
            ORDER BY dept, id;
        `;
            const result = yield db_1.pool.query(query, [
                deptList,
                yearStart,
                yearEnd,
                process.env.PGOVERALL_YEAR,
            ]);
            res.status(http_status_codes_1.StatusCodes.OK).json({ result: result.rows });
        }
        catch (err) {
            console.log("Error occurred during pool query:", { err });
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err });
        }
    });
}
//# sourceMappingURL=query.js.map