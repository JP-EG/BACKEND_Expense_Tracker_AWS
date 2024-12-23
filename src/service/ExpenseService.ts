import ExpenseRepository from "../repository/ExpenseRepository";
import { Expense } from "../expense/Expense";
import { ExpenseDtoBuilder } from "../dto/ExpenseDtoBuilder";
import { ExpenseDto } from "../dto/ExpenseDto";
import {Logger} from "../common/Logger";

export default class ExpenseService {
    private readonly expenseRepository: ExpenseRepository;
    private readonly logger: Logger;

    constructor(expenseRepository: ExpenseRepository = new ExpenseRepository()) {
        this.expenseRepository = expenseRepository;
        this.logger = new Logger('ExpenseService');  // Initialize the logger with the class name
    }

    public async post(expenseData: {
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

            const now = new Date().toISOString();
            expense.createdAt = now;
            expense.updatedAt = now;

            await this.expenseRepository.post(expense);
            this.logger.info(`Expense created successfully: ${JSON.stringify(expense)}`);
        } catch (error) {
            this.logger.error(`Failed to post expense: ${error}`);
            throw new Error('Unable to save the expense. Please try again.');
        }
    }

    public async delete(userId: string, expenseId: string): Promise<void> {
        try {
            if (!userId || !expenseId) {
                throw new Error('Missing required fields: userId or expenseId.');
            }

            await this.expenseRepository.delete(userId, expenseId);
            this.logger.info(`Expense deleted successfully: userId=${userId}, expenseId=${expenseId}`);
        } catch (error) {
            const errorMessage = `Failed to delete expense: userId=${userId}, expenseId=${expenseId}`;
            this.logger.error(error, errorMessage);
            throw new Error('Unable to delete the expense. Please try again.');
        }
    }

    public async update(userId: string, expenseId: string, updatedFields: Partial<Expense>): Promise<void> {
        try {
            if (!userId || !expenseId) {
                throw new Error('Missing required fields: userId or expenseId.');
            }

            updatedFields.updatedAt = new Date().toISOString();

            await this.expenseRepository.update(userId, expenseId, updatedFields);
            this.logger.info(`Expense updated successfully: userId=${userId}, expenseId=${expenseId}`);
        } catch (error) {
            const errorMessage = `Failed to update expense: userId=${userId}, expenseId=${expenseId}`;
            this.logger.error(error, errorMessage);
            throw new Error('Unable to update the expense. Please try again.');
        }
    }

    public async get(userId: string, expenseId?: string): Promise<ExpenseDto[] | null> {
        try {
            const expenses = await this.expenseRepository.get(userId, expenseId);

            if (!expenses || expenses.length === 0) {
                this.logger.warn(`No expenses found for userId=${userId}, expenseId=${expenseId}`);
                return null;
            }

            return expenses.flatMap((expense) => ExpenseDtoBuilder.build(expense));
        } catch (error) {
            const errorMessage = `Failed to fetch expenses: userId=${userId}, expenseId=${expenseId}`;
            this.logger.error(error, errorMessage);
            throw new Error('Unable to fetch the expenses. Please try again.');
        }
    }
}
