import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    merchant: {
      type: String,
      required: [true, "Merchant name is required"],
      trim: true,
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD", "CNY"], // Add more currencies as needed
      default: "INR", // Default currency
    },
    transactionDate: {
      type: Date,
      required: [true, "Transaction date is required"],
      default: Date.now,
    },
    sourceType: {
      type: String,
      enum: ["MANUAL", "SMS"],
      default: "MANUAL",
    },
    category: {
      type: String, // Can be ENUM or reference a Category model later
      enum: [
        "FOOD", // groceries, dining, snacks
        "TRANSPORT", // fuel, taxi, public transit
        "HOUSING", // rent, utilities, maintenance
        "HEALTH", // medicines, doctor, insurance
        "SHOPPING", // clothes, electronics, personal items
        "ENTERTAINMENT", // movies, subscriptions, games
        "EDUCATION", // school, courses, books
        "TRAVEL", // flights, hotels, tourism
        "BILLS", // phone, internet, DTH
        "FINANCE", // credit card, loans, investments
        "PERSONAL_CARE", // grooming, salon, cosmetics
        "MISCELLANEOUS", // donations, unknown, uncategorized
      ],
      default: "Miscellaneous",
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongoose.model("Expense", expenseSchema);
