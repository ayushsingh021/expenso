import { CategoryType, ExpenseCategoriesType } from "@/types";
import { colors } from "./theme";

import * as Icons from "phosphor-react-native"; // Import all icons dynamically

// export const expenseCategories: ExpenseCategoriesType = {
//   groceries: {
//     label: "Groceries",
//     value: "groceries",
//     icon: Icons.ShoppingCart,
//     bgColor: "#4B5563", // Deep Teal Green
//   },
//   rent: {
//     label: "Rent",
//     value: "rent",
//     icon: Icons.House,
//     bgColor: "#075985", // Dark Blue
//   },
//   utilities: {
//     label: "Utilities",
//     value: "utilities",
//     icon: Icons.Lightbulb,
//     bgColor: "#ca8a04", // Dark Golden Brown
//   },
//   transportation: {
//     label: "Transportation",
//     value: "transportation",
//     icon: Icons.Car,
//     bgColor: "#b45309", // Dark Orange-Red
//   },
//   entertainment: {
//     label: "Entertainment",
//     value: "entertainment",
//     icon: Icons.FilmStrip,
//     bgColor: "#0f766e", // Darker Red-Brown
//   },
//   dining: {
//     label: "Dining",
//     value: "dining",
//     icon: Icons.ForkKnife,
//     bgColor: "#be185d", // Dark Red
//   },
//   health: {
//     label: "Health",
//     value: "health",
//     icon: Icons.Heart,
//     bgColor: "#e11d48", // Dark Purple
//   },
//   insurance: {
//     label: "Insurance",
//     value: "insurance",
//     icon: Icons.ShieldCheck,
//     bgColor: "#404040", // Dark Gray
//   },
//   savings: {
//     label: "Savings",
//     value: "savings",
//     icon: Icons.PiggyBank,
//     bgColor: "#065F46", // Deep Teal Green
//   },
//   clothing: {
//     label: "Clothing",
//     value: "clothing",
//     icon: Icons.TShirt,
//     bgColor: "#7c3aed", // Dark Indigo
//   },
//   personal: {
//     label: "Personal",
//     value: "personal",
//     icon: Icons.User,
//     bgColor: "#a21caf", // Deep Pink
//   },
//   others: {
//     label: "Others",
//     value: "others",
//     icon: Icons.DotsThreeOutline,
//     bgColor: "#525252", // Neutral Dark Gray
//   },
// };

export const expenseCategories: ExpenseCategoriesType = {
  FOOD: {
    label: "Dining",
    value: "FOOD",
    icon: Icons.ForkKnife,
    bgColor: "#be185d", // Dark Red
  },
  TRANSPORT: {
    label: "Transportation",
    value: "TRANSPORT",
    icon: Icons.Car,
    bgColor: "#b45309", // Dark Orange-Red
  },
  HOUSING: {
    label: "Rent",
    value: "HOUSING",
    icon: Icons.House,
    bgColor: "#075985", // Dark Blue
  },
  HEALTH: {
    label: "Health",
    value: "HEALTH",
    icon: Icons.Heart,
    bgColor: "#e11d48", // Dark Purple
  },
  SHOPPING: {
    label: "Clothing",
    value: "SHOPPING",
    icon: Icons.TShirt,
    bgColor: "#7c3aed", // Dark Indigo
  },
  ENTERTAINMENT: {
    label: "Entertainment",
    value: "ENTERTAINMENT",
    icon: Icons.FilmStrip,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  EDUCATION: {
    label: "Education",
    value: "EDUCATION",
    icon: Icons.BookOpenText,
    bgColor: "#3b82f6", // Blue
  },
  TRAVEL: {
    label: "Travel",
    value: "TRAVEL",
    icon: Icons.AirplaneTilt,
    bgColor: "#8b5cf6", // Violet
  },
  BILLS: {
    label: "Utilities",
    value: "BILLS",
    icon: Icons.Lightbulb,
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  FINANCE: {
    label: "Savings",
    value: "FINANCE",
    icon: Icons.PiggyBank,
    bgColor: "#065F46", // Deep Teal Green
  },
  PERSONAL_CARE: {
    label: "Personal",
    value: "PERSONAL_CARE",
    icon: Icons.User,
    bgColor: "#a21caf", // Deep Pink
  },
  MISCELLANEOUS: {
    label: "Others",
    value: "MISCELLANEOUS",
    icon: Icons.DotsThreeOutline,
    bgColor: "#525252", // Neutral Dark Gray
  },
};
export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.CurrencyDollarSimple,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
