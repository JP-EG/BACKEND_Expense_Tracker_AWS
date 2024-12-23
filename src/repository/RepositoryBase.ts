import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export abstract class RepositoryBase {
    private readonly daysToLive: number;
    private static readonly HOURS_IN_DAY = 24;
    private static readonly MINUTES_IN_HOUR = 60;
    private static readonly SECONDS_IN_MINUTE = 60;

    protected readonly dynamoDBClient: DynamoDBClient;

    protected constructor(dynamoDBClient: DynamoDBClient, daysToLive: number) {
        this.dynamoDBClient = dynamoDBClient;
        this.daysToLive = daysToLive;
    }

    protected calculateExpiresAt(): number {
        const offsetInSeconds = this.daysToLive * RepositoryBase.HOURS_IN_DAY * RepositoryBase.MINUTES_IN_HOUR * RepositoryBase.SECONDS_IN_MINUTE;
        const secondsSinceEpoch = Date.now() / 1000;

        return Math.floor(secondsSinceEpoch + offsetInSeconds);
    }

}