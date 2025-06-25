import dotenv from "dotenv";
import { app } from "./app.js";

import { connectDB } from "./db/index.js";

dotenv.config({
  path: "./.env", // Path to your .env file
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
