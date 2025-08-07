import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { NotFoundResponse } from "../../responses/NotFoundResponse";
import { OkResponse } from "../../responses/OkResponse";
import { InternalServerErrorResponse } from "../../responses/InternalServerErrorResponse";
import ExpenseService from "../../service/ExpenseService";
import {Logger} from "../../common/Logger";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: {
        userId: string;
        expenseId?: string;
    }
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

const logger = new Logger('GET_EXPENSE_LAMBDA');
const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: Context) => {
    logger.info('GET_EXPENSE_LAMBDA_HANDLER');

    const { userId, expenseId } = event.queryStringParameters;
    const requestId = context.awsRequestId;

    logger.info(`START: Fetching expenses`, { userId, expenseId, requestId });

    try {
        const expenses = await expenseService.get(userId, expenseId);

        logger.info(`Expenses retrieved from DynamoDB`, { expenses });

        if (!expenses || (Array.isArray(expenses) && expenses.length === 0)) {
            const message = `No expenses found for user ${userId}`;
            logger.warn(message, { userId, expenseId, requestId });

            const response = new NotFoundResponse(`expenses`, requestId);
            logger.info(`COMPLETE`, { response });
            return response;
        }

        logger.info(`Expenses found`, { count: expenses.length, requestId });
        return new OkResponse(`expenses`, requestId, expenses);

    } catch (error) {
        logger.error({
            message: `Error fetching expenses`,
            context: { userId, expenseId, requestId },
            error,
        });

        const response = new InternalServerErrorResponse(`expenses`, requestId);
        logger.info(`COMPLETE`, { response });
        return response;
    }
};
