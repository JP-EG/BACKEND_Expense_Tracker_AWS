import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { BadRequestResponse } from "../responses/BadRequestResponse";
import { CreatedResponse } from "../responses/CreatedResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import {Expense} from "../expense/Expense";
import ExpenseService from "../service/ExpenseService";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'body'> & {
    body: Expense,
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

console.log('PUT_EXPENSE_LAMBDA');

const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
    console.log('PUT_EXPENSE_LAMBDA_HANDLER');
    console.log('Full event:', JSON.stringify(event, null, 2));
    const requestId = context.awsRequestId;
    console.log(`START`);

    try {
        if (!event.body) {
            const message = `Request body is missing.`;
            console.log(message);

            const response = new BadRequestResponse(`expense`, requestId);
            console.log(`COMPLETE ${JSON.stringify(response)}`);
            return response;
        }

        // Parse the body if it's a JSON string
        const expenseData: Expense = JSON.parse(event.body);
        console.log(`Received expense data: ${JSON.stringify(expenseData)}`);

        // Check if required fields are present in the expenseData
        if (!expenseData.userId || !expenseData.expenseId || !expenseData.amount || !expenseData.category || !expenseData.date) {
            const message = `Missing required fields: userId, expenseId, amount, category, and date.`;
            console.log(message);

            const response = new BadRequestResponse(`expense`, requestId);
            console.log(`COMPLETE ${JSON.stringify(response)}`);
            return response;
        }

        // Save the expense data
        await expenseService.putExpense(expenseData);

        console.log(`COMPLETE`);
        return new CreatedResponse(`expense/${expenseData.expenseId}`, requestId, expenseData);

    } catch (error) {
        console.error(error);

        const response = new InternalServerErrorResponse(`expense`, requestId);
        console.log(`COMPLETE ${JSON.stringify(response)}`);
        return response;
    }
};
