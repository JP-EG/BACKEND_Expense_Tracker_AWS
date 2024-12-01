import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { NotFoundResponse } from "../responses/NotFoundResponse";
import { OkResponse } from "../responses/OkResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import ExpenseService from "../service/ExpenseService";

// Modify HandlerEvent type to include only userId in queryStringParameters
export type HandlerEvent = Pick<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: {
        userId: string;
    }
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

console.log('GET_EXPENSE_LAMBDA');

// Initialize the ExpenseService instance
const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: Context) => {
    console.log('GET_EXPENSE_LAMBDA_HANDLER');

    const { userId } = event.queryStringParameters;
    console.log(`START: Fetching expenses for userId ${userId}`);
    const requestId = context.awsRequestId;

    try {
        // Fetch expenses for the given userId
        const expenses = await expenseService.get(userId);

        console.log(`Expenses from DynamoDB: ${JSON.stringify(expenses)}`);

        if (!expenses || (Array.isArray(expenses) && expenses.length === 0)) {
            const message = `No expenses found for user ${userId}`;
            console.log(message);

            // Return Not Found response if no expenses are found
            const response = new NotFoundResponse(`expenses`, requestId);
            console.log(`COMPLETE ${JSON.stringify(response)}`);
            return response;
        }

        // Return Ok response if expenses are found
        console.log('COMPLETE');
        return new OkResponse(`expenses`, requestId, expenses);

    } catch (error) {
        console.error(error);

        // Return Internal Server Error response if there's an issue
        const response = new InternalServerErrorResponse(`expenses`, requestId);
        console.log(`COMPLETE ${JSON.stringify(response)}`);
        return response;
    }
};