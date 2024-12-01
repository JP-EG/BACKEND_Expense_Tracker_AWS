import {ExpenseDocument} from "../documents/ExpenseDocument";
import {Expense} from "../expense/Expense";


export default class ExpenseBuilder {
    static fromDocument(source: ExpenseDocument): Expense {
        const expense = new Expense();

        expense.userId = source.userId;
        expense.expenseId = source.expenseId;
        expense.amount = source.amount;
        expense.category = source.category;
        expense.date = source.date;
        expense.description = source.description;
        return expense;
    }

    static toDocument(expense: Expense): ExpenseDocument {
        return {
            userId: expense.userId,
            expenseId: expense.expenseId,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            description: expense.description,
        };
    }
}
