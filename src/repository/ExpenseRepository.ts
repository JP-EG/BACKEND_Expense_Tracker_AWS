import {
    DynamoDBClient,
    QueryCommand,
    PutItemCommand,
    DeleteItemCommand,
    QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { RepositoryBase } from "./RepositoryBase";
import { Expense } from "../expense/Expense";
import { ExpenseDocument } from "../documents/ExpenseDocument";
import ExpenseBuilder from "../builder/ExpenseBuilder";
import {Logger} from "../common/Logger";

export default class ExpenseRepository extends RepositoryBase {
    private readonly tableName: string | undefined;
    private readonly logger: Logger;

    constructor(
        dynamoDBClient: DynamoDBClient = new DynamoDBClient(),
        tableName = process.env.EXPENSE_TABLE_NAME,
        timeToLiveConfigValue = process.env.EXPENSE_TTL_TABLE,
    ) {
        if (!tableName) {
            throw new Error(`EXPENSE_REPOSITORY ${tableName}`);
        }

        const timeToLive = Number(timeToLiveConfigValue);
        if (!timeToLive) {
            throw new Error(`EXPENSE_REPOSITORY_TTL ${tableName}`);
        }

        super(dynamoDBClient, timeToLive);
        this.tableName = tableName;
        this.logger = new Logger('ExpenseRepository');
    }

    public async delete(userId: string, expenseId: string): Promise<void> {
        const deleteCommand = new DeleteItemCommand({
            TableName: this.tableName,
            Key: marshall({
                userId: `${userId}`,
                expenseId: `${expenseId}`,
            }),
        });

        try {
            await this.dynamoDBClient.send(deleteCommand);
            this.logger.info(`Expense deleted successfully: userId=${userId}, expenseId=${expenseId}`);
        } catch (error) {
            this.logger.error(error, `Failed to delete expense: userId=${userId}, expenseId=${expenseId}`);
            throw new Error('Error deleting expense from DynamoDB');
        }
    }

    public async get(userId: string, expenseId?: string): Promise<Expense[] | null> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const baseParams: Record<string, any> = {
            TableName: this.tableName,
            IndexName: "userId-expenseId-index",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": { S: userId },
            },
        };

        if (expenseId) {
            baseParams.KeyConditionExpression += " AND expenseId = :expenseId";
            baseParams.ExpressionAttributeValues[":expenseId"] = { S: expenseId };
        }

        try {
            const queryCommand = new QueryCommand(<QueryCommandInput>baseParams);
            const { Items } = await this.dynamoDBClient.send(queryCommand);

            if (Items) {
                return Items.map((item) =>
                    ExpenseBuilder.fromDocument(unmarshall(item) as ExpenseDocument)
                );
            }
        } catch (error) {
            const errorMessage = "Error querying expenses:";
            this.logger.error(error, errorMessage);
            throw error;
        }

        return null;
    }

    public async update(userId: string, expenseId: string, updatedExpense: Partial<Expense>): Promise<void> {
        try {
            const currentExpenses = await this.get(userId, expenseId);
            if (!currentExpenses || currentExpenses.length === 0) {
                throw new Error(`Expense not found: userId=${userId}, expenseId=${expenseId}`);
            }

            const currentExpense = currentExpenses[0];

            const updatedExpenseData: Expense = {
                ...currentExpense,
                ...updatedExpense,
            };

            const expenseDocument: ExpenseDocument = ExpenseBuilder.toDocument(updatedExpenseData);

            const putCommand = new PutItemCommand({
                TableName: this.tableName,
                Item: marshall({
                    pk: `USER#${userId}`,
                    sk: `EXPENSE#${expenseId}`,
                    ...expenseDocument,
                }),
            });

            await this.dynamoDBClient.send(putCommand);
            this.logger.info(`Expense updated successfully: userId=${userId}, expenseId=${expenseId}`);
        } catch (error) {
            this.logger.error(error, `Failed to update expense: userId=${userId}, expenseId=${expenseId}`);
            throw new Error('Error updating expense in DynamoDB');
        }
    }

    public async post(expense: Expense): Promise<void> {
        const expenseDocument: ExpenseDocument = ExpenseBuilder.toDocument(expense);

        const putCommand = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall({
                pk: `USER#${expense.userId}`,
                sk: `EXPENSE#${expense.expenseId}`,
                ...expenseDocument,
            }),
        });

        try {
            await this.dynamoDBClient.send(putCommand);
            this.logger.info(`Expense saved successfully: ${JSON.stringify(expense)}`);
        } catch (error) {
            this.logger.error(error, 'Failed to save expense');
            throw new Error('Error saving expense to DynamoDB');
        }
    }
}
