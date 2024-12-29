// Backend entry point

import app from "./app";
import dotenv from "dotenv";

const start = async () => {
  try {
    dotenv.config({ path: "../.env" }); //load the global .env at root directory

    console.log("Starting application...");

    // Load environment variables
    const port = process.env.SERVER_PORT || 3000;

    // Connect to PostgreSQL

    // Start server
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1);
  }
};

start();
