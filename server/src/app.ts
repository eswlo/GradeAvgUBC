// Express app
import express, { Application } from "express";
import cors from "cors";
import * as GradesController from "./controllers/grades";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "../.env" }); // Load .env file in non-production environments
}

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Api endpoints
app.get("/api/v1/grades/departments", GradesController.getDepts);
app.get("/api/v1/grades/years", GradesController.getYears);
app.get(
  "/api/v1/grades/averages/:dept/:id/:title",
  GradesController.getAvgHistByCourse,
);
app.post("/api/v1/grades/averages", GradesController.getAvgs);

export default app;
