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

    public async get(name: string): Promise<Person | null> {
        const getCommand: GetItemCommand = new GetItemCommand({
            TableName: this.tableName,
            Key: { name: { S: name }},
        });

        const { Item }: GetItemCommandOutput = await this.dynamoDBClient.send(getCommand);

        if(Item){
            const personDocument: PersonDocument = unmarshall(Item) as PersonDocument;

            return PersonBuilder.fromDocument(personDocument);
        }

        return null;
    }
}