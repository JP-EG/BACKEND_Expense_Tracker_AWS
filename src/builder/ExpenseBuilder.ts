import { ExpenseDocument } from "../documents/ExpenseDocument";
import { Expense } from "../expense/Expense";

export default class ExpenseBuilder {
    static fromDocument(source: ExpenseDocument): Expense {
        const expense = new Expense();

        expense.userId = source.userId;
        expense.expenseId = source.expenseId;
        expense.amount = source.amount;
        expense.category = source.category;
        expense.date = source.date;
        expense.description = source.description; // Optional
        expense.subCategory = source.subCategory; // Optional
        expense.paymentMethod = source.paymentMethod; // Optional
        expense.location = source.location; // Optional
        expense.tags = source.tags; // Optional
        expense.createdAt = source.createdAt; // Optional
        expense.updatedAt = source.updatedAt; // Optional

        return expense;
    }

    static toDocument(expense: Expense): ExpenseDocument {
        return {
            userId: expense.userId,
            expenseId: expense.expenseId,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            description: expense.description, // Optional
            subCategory: expense.subCategory, // Optional
            paymentMethod: expense.paymentMethod, // Optional
            location: expense.location, // Optional
            tags: expense.tags, // Optional
            createdAt: expense.createdAt, // Optional
            updatedAt: expense.updatedAt, // Optional
        };
    }
}
