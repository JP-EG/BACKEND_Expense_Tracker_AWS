import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { NotFoundResponse } from "../responses/NotFoundResponse";
import { OkResponse } from "../responses/OkResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import ExpenseService from "../service/ExpenseService";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: {
        userId: string;
    }
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

console.log('GET_EXPENSE_LAMBDA');

const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: Context) => {
    console.log('GET_EXPENSE_LAMBDA_HANDLER');

    const { userId } = event.queryStringParameters;
    console.log(`START: Fetching expenses for userId ${userId}`);
    const requestId = context.awsRequestId;

    try {
        const expenses = await expenseService.get(userId);

        console.log(`Expenses from DynamoDB: ${JSON.stringify(expenses)}`);

        if (!expenses || (Array.isArray(expenses) && expenses.length === 0)) {
            const message = `No expenses found for user ${userId}`;
            console.log(message);

            const response = new NotFoundResponse(`expenses`, requestId);
            console.log(`COMPLETE ${JSON.stringify(response)}`);
            return response;
        }

        console.log('COMPLETE');
        return new OkResponse(`expenses`, requestId, expenses);

    } catch (error) {
        console.error(error);

        const response = new InternalServerErrorResponse(`expenses`, requestId);
        console.log(`COMPLETE ${JSON.stringify(response)}`);
        return response;
    }
};