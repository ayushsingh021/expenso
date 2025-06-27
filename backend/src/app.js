import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); //is used in an Express.js application to parse incoming JSON request bodies, with a size limit.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parses incoming requests with URL-encoded payloads, with a size limit.
app.use(cookieParser()); // Parses cookies attached to the client request object.
app.use(express.static("public")); // Serves static files from the 'public' directory.

//routes import
import userRouter from "./routes/user.routes.js";
import expenseRouter from "./routes/expense.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);


export { app };
