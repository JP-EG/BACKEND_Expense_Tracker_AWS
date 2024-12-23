export interface ExpenseDto {
    userId: string;        // Unique identifier for the user
    expenseId: string;     // Unique identifier for the expense
    amount: number;        // Expense amount
    category: string;      // Expense category (e.g., Food, Travel)
    date: string;          // Date of the expense (ISO 8601 format)
    description?: string;  // Optional description of the expense
    subCategory?: string;  // Optional subcategory for the expense
    paymentMethod?: string; // Optional payment method (e.g., Credit Card, Cash)
    location?: string;     // Optional location of the expense (e.g., store name, city)
    tags?: string[];       // Optional tags for categorization (e.g., ["business", "personal"])
    createdAt?: string;    // Timestamp when the expense was created (ISO 8601 format)
    updatedAt?: string;
}
