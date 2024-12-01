import ExpenseRepository from "../repository/ExpenseRepository";
import {Expense} from "../expense/Expense";
import {ExpenseDtoBuilder} from "../dto/ExpenseDtoBuilder";


export default class ExpenseService {
    private readonly expenseRepository: ExpenseRepository;

    constructor(expenseRepository: ExpenseRepository = new ExpenseRepository()) {
        this.expenseRepository = expenseRepository;
    }

    // Create a new expense and save it to the repository
    public async putExpense(expenseData: { userId: string; expenseId: string; amount: number; category: string; date: string; description?: string }): Promise<void> {
        const expense = new Expense();
        expense.userId = expenseData.userId;
        expense.expenseId = expenseData.expenseId;
        expense.amount = expenseData.amount;
        expense.category = expenseData.category;
        expense.date = expenseData.date;
        expense.description = expenseData.description;

        // Save the expense to the repository
        await this.expenseRepository.put(expense);
    }

    // Fetch all expenses for a given user
    public async get(userId: string): Promise<Expense | null> {
        // Fetch the expenses from the repository
        const expenses = await this.expenseRepository.get(userId);

        // If no expenses are found, return null
        if (!expenses || expenses.length === 0) {
            return null;
        }

        // Return the expenses after mapping them to DTOs
        return expenses ? ExpenseDtoBuilder.build(expenses[0]) : null;
    }
}
