import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { BadRequestResponse } from "../responses/BadRequestResponse";
import { CreatedResponse } from "../responses/CreatedResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import { Expense } from "../expense/Expense";
import ExpenseService from "../service/ExpenseService";
import {Logger} from "../common/Logger";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'body'> & {
    body: Expense,
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

const logger = new Logger('POST_EXPENSE_LAMBDA');
const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
    logger.info('POST_EXPENSE_LAMBDA_HANDLER');

    const requestId = context.awsRequestId;
    logger.info('START');

    try {
        if (!event.body) {
            const message = `Request body is missing.`;
            logger.warn(message);

            const response = new BadRequestResponse('expense', requestId);
            logger.info('COMPLETE', response);
            return response;
        }

        const expenseData: Expense = JSON.parse(event.body);
        logger.info(`Received expense data: ${JSON.stringify(expenseData)}`);

        if (!expenseData.userId || !expenseData.expenseId || !expenseData.amount || !expenseData.category || !expenseData.date) {
            const message = `Missing required fields: userId, expenseId, amount, category, and date`;
            logger.warn(message);

            const response = new BadRequestResponse('expense', requestId);
            logger.info('COMPLETE', response);
            return response;
        }

        await expenseService.post(expenseData);

        logger.info('COMPLETE');
        return new CreatedResponse(`expense/${expenseData.expenseId}`, requestId, expenseData);

    } catch (error) {
        logger.error(error);

        const response = new InternalServerErrorResponse('expense', requestId);
        logger.info('COMPLETE', response);
        return response;
    }
};
