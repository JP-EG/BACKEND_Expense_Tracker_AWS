export class Expense {
    userId: string;       // Unique identifier for the user
    expenseId: string;    // Unique identifier for the expense
    amount: number;       // Expense amount
    category: string;     // Expense category (e.g., Food, Travel)
    date: string;         // Date of the expense (ISO 8601 format)
    description?: string; // Optional description of the expense
}
