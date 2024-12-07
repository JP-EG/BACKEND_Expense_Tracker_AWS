import ExpenseRepository from "../repository/ExpenseRepository";
import {Expense} from "../expense/Expense";
import {ExpenseDtoBuilder} from "../dto/ExpenseDtoBuilder";


export default class ExpenseService {
    private readonly expenseRepository: ExpenseRepository;

    constructor(expenseRepository: ExpenseRepository = new ExpenseRepository()) {
        this.expenseRepository = expenseRepository;
    }

    // Create a new expense and save it to the repository
    public async putExpense(expenseData: {
        userId: string;
        expenseId: string;
        amount: number;
        category: string;
        date: string;
        description?: string;
        subCategory?: string;
        paymentMethod?: string;
        location?: string;
        tags?: string[];
    }): Promise<void> {
        try {
            // Validate required fields
            if (!expenseData.userId || !expenseData.expenseId || !expenseData.amount || !expenseData.category || !expenseData.date) {
                throw new Error('Missing required fields: userId, expenseId, amount, category, or date.');
            }

            const expense = new Expense();
            expense.userId = expenseData.userId;
            expense.expenseId = expenseData.expenseId;
            expense.amount = expenseData.amount;
            expense.category = expenseData.category;
            expense.date = expenseData.date;
            expense.description = expenseData.description;
            expense.subCategory = expenseData.subCategory;
            expense.paymentMethod = expenseData.paymentMethod;
            expense.location = expenseData.location;
            expense.tags = expenseData.tags;

            // Automatically set timestamps
            const now = new Date().toISOString();
            expense.createdAt = now;
            expense.updatedAt = now;

            // Save the expense to the repository
            await this.expenseRepository.put(expense);
        } catch (error) {
            console.error('Failed to put expense:', error);
            throw new Error('Unable to save the expense. Please try again.');
        }
    }

    public async delete(userId: string, expenseId: string): Promise<void> {
        try {
            // Validate required fields
            if (!userId || !expenseId) {
                throw new Error('Missing required fields: userId or expenseId.');
            }

            // Call the repository's delete method
            await this.expenseRepository.delete(userId, expenseId);
            console.log(`Expense deleted successfully: userId=${userId}, expenseId=${expenseId}`);
        } catch (error) {
            console.error(`Failed to delete expense: userId=${userId}, expenseId=${expenseId}`, error);
            throw new Error('Unable to delete the expense. Please try again.');
        }
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
