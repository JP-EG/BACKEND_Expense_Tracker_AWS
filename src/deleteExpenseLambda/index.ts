import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { NotFoundResponse } from "../responses/NotFoundResponse";
import { OkResponse } from "../responses/OkResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import ExpenseService from "../service/ExpenseService";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: {
        userId: string;
        expenseId: string;
    };
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

console.log('DELETE_EXPENSE_LAMBDA');

const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: Context) => {
    console.log('DELETE_EXPENSE_LAMBDA_HANDLER');

    const { userId, expenseId } = event.queryStringParameters;
    const requestId = context.awsRequestId;

    console.log(`START: Deleting expense for userId=${userId}, expenseId=${expenseId}`);

    try {
        if (!userId || !expenseId) {
            console.error(`Missing required parameters: userId=${userId}, expenseId=${expenseId}`);
            return new NotFoundResponse(`Missing userId or expenseId`, requestId);
        }

        await expenseService.delete(userId, expenseId);

        console.log(`Expense deleted successfully: userId=${userId}, expenseId=${expenseId}`);
        return new OkResponse(`Expense deleted successfully`, requestId);

    } catch (error) {
        console.error(`Error deleting expense for userId=${userId}, expenseId=${expenseId}`, error);

        const response = new InternalServerErrorResponse(`Failed to delete expense`, requestId);
        console.log(`COMPLETE ${JSON.stringify(response)}`);
        return response;
    }
};
