import { Router } from "express";
import {
  createExpense,
  getAllExpenses,
  deleteExpense,
  getExpenseById,
  updateExpenseDetails,
  createExpenseFromMessage,
} from "../controllers/expense.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// All routes below require authentication
router.use(verifyJWT);

// Create a new expense
router.route("/create-expense").post(createExpense);
router.route("/create-expense-from-message").post(createExpenseFromMessage);

// Get all expenses for the logged-in user
router.route("/get-all-expense").get(getAllExpenses);

// Get, update, or delete a specific expense by ID
router
  .route("/:id")
  .get(getExpenseById)
  .put(updateExpenseDetails)
  .delete(deleteExpense);

export default router;
