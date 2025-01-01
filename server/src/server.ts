// Backend entry point

import app from "./app";
import dotenv from "dotenv";

export const start = () => {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: "../.env" }); // Load .env file in non-production environments
  }

  try {
    console.log("Starting application...");

    // Load environment variables
    const port = process.env.SERVER_PORT || 3000;

    // Start server
    const server = app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
    return server;
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1);
  }
};

start();
