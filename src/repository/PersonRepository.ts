import {
    DynamoDBClient,
    GetItemCommand,
    GetItemCommandOutput,
    PutItemCommand,
    QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {RepositoryBase} from "./RepositoryBase";
import {Person} from "../person/Person";
import PersonBuilder from "../builder/PersonBuilder";
import {PersonDocument} from "../documents/PersonDocument";

export default class PersonRepository extends RepositoryBase {
    private readonly tableName: string | undefined;

    constructor(
        dynamoDBClient: DynamoDBClient = new DynamoDBClient(),
        tableName = process.env.PERSON_TABLE_NAME,
        timeToLiveConfigValue = process.env.PERSON_TTL_TABLE,
    ) {
        if(!tableName){
            throw new Error(`PERSON_REPOSITORY ${tableName}`)
        }

        const timeToLive = Number(timeToLiveConfigValue);
        if(!timeToLive){
            throw new Error(`PERSON_REPOSITORY_TTL ${tableName}`)
        }

        super(dynamoDBClient, timeToLive);
        this.tableName = tableName;
    }

    public async get(personName: string): Promise<Person | null> {
        const queryCommand: QueryCommand = new QueryCommand({
            TableName: this.tableName,
            IndexName: "personName-index", // Use the GSI
            KeyConditionExpression: "personName = :personName",
            ExpressionAttributeValues: {
                ":personName": { S: personName },
            },
        });

        const { Items } = await this.dynamoDBClient.send(queryCommand);

        if(Items?.length){
            const personDocument: PersonDocument = unmarshall(Items[0]) as PersonDocument;
            return PersonBuilder.fromDocument(personDocument);
        }

        return null;
    }

    public async put(person: Person): Promise<void> {
        // Convert the Person object to a DynamoDB-compatible document
        const personDocument: PersonDocument = PersonBuilder.toDocument(person);

        const putCommand = new PutItemCommand({
            TableName: this.tableName,
            Item: marshall({
                pk: `PERSON#${person.personName}`,
                sk: `#METADATA`, // Include if a sort key is required
                ...personDocument,
            }),
        });

        try {
            await this.dynamoDBClient.send(putCommand);
            console.log(`Person saved successfully: ${JSON.stringify(person)}`);
        } catch (error) {
            console.error(`Failed to save person: ${error}`);
            throw new Error('Error saving person to DynamoDB');
        }
    }
}