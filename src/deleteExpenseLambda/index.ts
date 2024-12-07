import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { NotFoundResponse } from "../responses/NotFoundResponse";
import { OkResponse } from "../responses/OkResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import ExpenseService from "../service/ExpenseService";

// Modify HandlerEvent type to include both userId and expenseId in queryStringParameters
export type HandlerEvent = Pick<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: {
        userId: string;
        expenseId: string;
    };
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

console.log('DELETE_EXPENSE_LAMBDA');

// Initialize the ExpenseService instance
const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: Context) => {
    console.log('DELETE_EXPENSE_LAMBDA_HANDLER');

    const { userId, expenseId } = event.queryStringParameters;
    const requestId = context.awsRequestId;

    console.log(`START: Deleting expense for userId=${userId}, expenseId=${expenseId}`);

    try {
        // Validate inputs
        if (!userId || !expenseId) {
            console.error(`Missing required parameters: userId=${userId}, expenseId=${expenseId}`);
            return new NotFoundResponse(`Missing userId or expenseId`, requestId);
        }

        // Attempt to delete the expense
        await expenseService.delete(userId, expenseId);

        // Return Ok response after successful deletion
        console.log(`Expense deleted successfully: userId=${userId}, expenseId=${expenseId}`);
        return new OkResponse(`Expense deleted successfully`, requestId);

    } catch (error) {
        console.error(`Error deleting expense for userId=${userId}, expenseId=${expenseId}`, error);

        // Return Internal Server Error response in case of failure
        const response = new InternalServerErrorResponse(`Failed to delete expense`, requestId);
        console.log(`COMPLETE ${JSON.stringify(response)}`);
        return response;
    }
};
