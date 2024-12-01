import {
    DynamoDBClient,
    QueryCommand,
    PutItemCommand, QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { RepositoryBase } from "./RepositoryBase";
import {Expense} from "../expense/Expense";
import {ExpenseDocument} from "../documents/ExpenseDocument";
import ExpenseBuilder from "../builder/ExpenseBuilder";

export default class ExpenseRepository extends RepositoryBase {
    private readonly tableName: string | undefined;

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
    }

    // Fetch expenses by userId and optional filters
    public async get(userId: string): Promise<Expense[] | null> {
        const baseParams = {
            TableName: this.tableName,
            IndexName: "userId-index",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": { S: userId },
            },
        };

        console.log("Query Params:", baseParams);

        const queryCommand = new QueryCommand(baseParams);

        const { Items } = await this.dynamoDBClient.send(queryCommand);

        if (Items) {
            return Items.map((item) => ExpenseBuilder.fromDocument(unmarshall(item) as ExpenseDocument));
        }

        return null;
    }

    // Save a new expense
    public async put(expense: Expense): Promise<void> {
        // Convert the Expense object to a DynamoDB-compatible document
        const expenseDocument: ExpenseDocument = ExpenseBuilder.toDocument(expense);

        const putCommand = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall({
                pk: `USER#${expense.userId}`,        // Partition key
                sk: `EXPENSE#${expense.expenseId}`, // Sort key
                ...expenseDocument,
            }),
        });

        try {
            await this.dynamoDBClient.send(putCommand);
            console.log(`Expense saved successfully: ${JSON.stringify(expense)}`);
        } catch (error) {
            console.error(`Failed to save expense: ${error}`);
            throw new Error('Error saving expense to DynamoDB');
        }
    }
}
