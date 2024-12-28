// Express app
import express from 'express';
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { pool } from "./db"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/v1/courses', async (req, res) => {
    try {
        const result = await pool.query("SELECT * from sections");
        const resultLength = result.rowCount;
        res.status(StatusCodes.OK).json({ resultLength });
    } catch(err) {
        console.log("Error occurred during pool query:", {err});
    }
})

export default app;