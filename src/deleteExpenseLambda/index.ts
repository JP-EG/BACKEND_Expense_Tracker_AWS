import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { NotFoundResponse } from "../responses/NotFoundResponse";
import { OkResponse } from "../responses/OkResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import ExpenseService from "../service/ExpenseService";
import {Logger} from "../common/Logger";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: {
        userId: string;
        expenseId: string;
    };
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

const logger = new Logger('DELETE_EXPENSE_LAMBDA');
const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: Context) => {
    logger.info('DELETE_EXPENSE_LAMBDA_HANDLER');

    const { userId, expenseId } = event.queryStringParameters;
    const requestId = context.awsRequestId;

    logger.info(`START: Deleting expense`, { userId, expenseId, requestId });

    try {
        if (!userId || !expenseId) {
            logger.warn(`Missing required parameters`, { userId, expenseId, requestId });
            return new NotFoundResponse(`Missing userId or expenseId`, requestId);
        }

        await expenseService.delete(userId, expenseId);

        logger.info(`Expense deleted successfully`, { userId, expenseId, requestId });
        return new OkResponse(`Expense deleted successfully`, requestId, null);
    } catch (error) {
        logger.error({
            message: `Error deleting expense`,
            context: { userId, expenseId, requestId },
            error,
        });

        const response = new InternalServerErrorResponse(`Failed to delete expense`, requestId);
        logger.info(`COMPLETE`, { response });
        return response;
    }
};
