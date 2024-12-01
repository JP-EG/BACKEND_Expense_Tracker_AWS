import {Expense} from "../expense/Expense";
import {ExpenseDto} from "./ExpenseDto";


export class ExpenseDtoBuilder {
    static build(source: Expense): ExpenseDto {
        return {
            expenseId: source.expenseId,
            userId: source.userId,
            amount: source.amount,
            category: source.category,
            date: source.date,
            description: source.description, // Optional
        };
    }
}
