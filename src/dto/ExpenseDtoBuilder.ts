import { Expense } from "../expense/Expense";
import { ExpenseDto } from "./ExpenseDto";

export class ExpenseDtoBuilder {
    static build(source: Expense): ExpenseDto {
        return {
            expenseId: source.expenseId,
            userId: source.userId,
            amount: source.amount,
            category: source.category,
            date: source.date,
            description: source.description, // Optional
            subCategory: source.subCategory, // Optional
            paymentMethod: source.paymentMethod, // Optional
            location: source.location, // Optional
            tags: source.tags, // Optional
            createdAt: source.createdAt, // Optional
            updatedAt: source.updatedAt, // Optional
        };
    }
}
