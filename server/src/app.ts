// Express app
import express, { Application } from "express";
import cors from "cors";
import * as QueryController from "./controllers/query";
import dotenv from "dotenv";


dotenv.config({ path: '../.env' }); //load the global .env at root directory
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Api endpoints
app.post('/api/v1/query/average', QueryController.getAvg);

export default app;