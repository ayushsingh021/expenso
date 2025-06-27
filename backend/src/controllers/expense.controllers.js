import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Expense } from "../models/expense.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";


const createExpense = asyncHandler(async (req, res) => {
  //logic
  // 1. get expense details from frontend
  // 2. validation - not empty
  // 4. create expense object, create entry in db
  // 5. return response

  // 1. get expense details from frontend
  const { amount, merchant, currency, transactionDate, sourceType, category } =
    req.body;

  const allowedCurrencies = [
    "USD",
    "EUR",
    "INR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CNY",
  ];
  if (currency && !allowedCurrencies.includes(currency)) {
    throw new ApiError(400, "Invalid currency");
  }
  // 2. validation - not empty
  if (
    [amount, merchant, currency, transactionDate, sourceType, category].some(
      (field) =>
        field === undefined || field === null || field.toString().trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // 3. create expense object, create entry in db
  const expense = await Expense.create({
    userId: req.user._id, // Assuming req.user is set by authentication middleware
    amount,
    merchant,
    currency,
    transactionDate,
    sourceType,
    category,
  });
  // 4. return creted expense in response
  res
    .status(201)
    .json(new ApiResponse("Expense created successfully", expense));
});
const createExpenseFromMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    throw new ApiError(400, "Message text is required");
  }

  try {
    // Call FastAPI
    const response = await axios.post("http://127.0.0.1:8000/api/v1/message", {
      message,
    });

    if (response.data.status !== "success") {
      throw new ApiError(500, "Failed to parse message from AI");
    }

    const {
      amount,
      merchant,
      currency = "INR",
      transactionDate = new Date().toISOString(),
      sourceType = "SMS",
      category,
    } = {
      ...response.data.data,
      currency:
        !response.data.data.currency ||
        response.data.data.currency.trim() === ""
          ? "INR"
          : response.data.data.currency,
      transactionDate:
        response.data.data.transactionDate || new Date().toISOString(),
      sourceType: response.data.data.sourceType || "SMS",
    };

    // Convert and validate amount
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new ApiError(400, "Invalid amount");
    }

    // Validate required fields

    // Reuse validation logic
    const allowedCurrencies = [
      "USD",
      "EUR",
      "INR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CNY",
    ];
    if (currency && !allowedCurrencies.includes(currency)) {
      throw new ApiError(400, "Invalid currency");
    }

    if (
      [
        parsedAmount,
        merchant,
        currency,
        transactionDate,
        sourceType,
        category,
      ].some(
        (field) =>
          field === undefined ||
          field === null ||
          field.toString().trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // Create expense

    // Create and save expense
    const expense = await Expense.create({
      userId: req.user._id,
      amount: parsedAmount,
      merchant,
      currency,
      transactionDate,
      sourceType,
      category,
    });

    res
      .status(201)
      .json(new ApiResponse("Expense created from message", expense));
  } catch (error) {
    console.error("FastAPI parsing error:", error.message);
    throw new ApiError(500, "Could not create expense from message");
  }
});
const getAllExpenses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Filters
  const { category, from, to, page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const filter = { userId };

  if (category) {
    filter.category = category.toLowerCase(); // match enum value
  }

  if (from || to) {
    filter.transactionDate = {};
    if (from) filter.transactionDate.$gte = new Date(from);
    if (to) filter.transactionDate.$lte = new Date(to);
  }

  const expenses = await Expense.find(filter)
    .sort({ transactionDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Expense.countDocuments(filter);

  if (!expenses || expenses.length === 0) {
    throw new ApiError(404, "No expenses found for this user");
  }

  res.status(200).json(
    new ApiResponse("Expenses retrieved successfully", {
      expenses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    })
  );
});

const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await Expense.findOne({
    _id: id,
    userId: req.user._id, // Ensure user owns the expense
  });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  res
    .status(200)
    .json(new ApiResponse("Expense fetched successfully", expense));
});



const updateExpenseDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const allowedFields = [
    "amount",
    "merchant",
    "currency",
    "transactionDate",
    "sourceType",
    "category",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "At least one field must be provided for update");
  }

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: id, userId: req.user?._id },
    { $set: updates },
    { new: true }
  );

  if (!updatedExpense) {
    throw new ApiError(404, "Expense not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedExpense, "Expense updated successfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleteExpense = await Expense.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });

  if (!deleteExpense) {
    throw new ApiError(404, "Expense not found or unauthorized");
  }

  res
    .status(200)
    .json(new ApiResponse("Expense deleted successfully", deleteExpense));
});
export {
  createExpense,
  createExpenseFromMessage,
  getAllExpenses,
  getExpenseById,
  updateExpenseDetails,
  deleteExpense,
 
};
