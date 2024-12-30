import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { pool } from "../db";

export async function getDepts(req: Request, res: Response): Promise<void> {
  try {
    const query = `SELECT DISTINCT dept FROM sections ORDER BY dept;`;
    const result = await pool.query(query);
    res.status(StatusCodes.OK).json({ result: result.rows });
  } catch (err) {
    console.log("Error occurred in getDepts method:", { err });
    res.status(StatusCodes.BAD_REQUEST).json({ error: err });
  }
}

export async function getAvg(req: Request, res: Response): Promise<void> {
  const { deptList, levelList, avgLowerBound, avgHigherBound, yearStart, yearEnd } =
    req.body;
  try {
    if (!deptList || deptList.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Provide at least one department." });
      return;
    }

    if (!levelList || levelList.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Provide at least one course level." });
      return;
    }

    if (avgLowerBound > avgHigherBound) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Average lower bound is larger than higher bound." });
      return;
    }

    if (yearStart > yearEnd) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Wrong year range." });
      return;
    }

    const levelConditions = levelList
      .map((level: number) => {
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
    const result = await pool.query(query, [
      deptList,
      yearStart,
      yearEnd,
      process.env.PGOVERALL_YEAR,
    ]);
    const filteredResult = result.rows.filter(
      (row) => row.average >= avgLowerBound && row.average <= avgHigherBound,
    );
    res.status(StatusCodes.OK).json({ result: filteredResult });
  } catch (err) {
    console.log("Error occurred during pool query:", { err });
    res.status(StatusCodes.BAD_REQUEST).json({ error: err });
  }
}
