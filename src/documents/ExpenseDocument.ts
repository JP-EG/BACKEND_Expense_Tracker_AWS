export interface ExpenseDocument {
    userId: string;       // Unique identifier for the user
    expenseId: string;    // Unique identifier for the expense
    amount: number;       // Expense amount
    category: string;     // Expense category (e.g., Food, Travel)
    date: string;         // ISO string for the date of the expense
    description?: string; // Optional description of the expense
}
