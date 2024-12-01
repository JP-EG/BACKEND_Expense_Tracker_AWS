export interface ExpenseDto {
    expenseId: string;
    userId: string;
    amount: number;
    category: string;
    date: string;
    description?: string;
}
