import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { BadRequestResponse } from "../responses/BadRequestResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import { Expense } from "../expense/Expense";
import ExpenseService from "../service/ExpenseService";
import { OkResponse } from "../responses/OkResponse";
import {Logger} from "../common/Logger";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'body'> & {
    body: Expense,
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

const logger = new Logger('PUT_EXPENSE_LAMBDA');
const expenseService = new ExpenseService();

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
    logger.info('PUT_EXPENSE_LAMBDA_HANDLER');
    const requestId = context.awsRequestId;
    logger.info('START');

    try {
        if (!event.body) {
            const message = `Request body is missing.`;
            logger.warn(message);

            const response = new BadRequestResponse('expense', requestId);
            logger.info(`COMPLETE`, response);
            return response;
        }

        const expenseData: Expense = JSON.parse(event.body);
        logger.info(`Received expense data: ${JSON.stringify(expenseData)}`);

        const existingExpense = await expenseService.get(expenseData.userId, expenseData.expenseId);

        if (existingExpense) {
            logger.info(`Expense exists. Updating...`);
            await expenseService.update(expenseData.userId, expenseData.expenseId, expenseData);
            logger.info(`Expense updated: ${JSON.stringify(expenseData)}`);

            logger.info('COMPLETE');
            return new OkResponse('update-expense', requestId, existingExpense);
        } else {
            logger.warn(`Expense does not exist`);
            return new BadRequestResponse(`expense/${expenseData.expenseId}`, requestId);
        }
    } catch (error) {
        logger.error(error);

        const response = new InternalServerErrorResponse('expense', requestId);
        logger.info(`COMPLETE`, response);
        return response;
    }
};
