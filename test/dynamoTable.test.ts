import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

describe('DynamoDB Table', () => {
    let stack: cdk.Stack;

    beforeEach(() => {
        stack = new cdk.Stack();
        new dynamodb.Table(stack, "dynamocdktable", {
            tableName: "dynamocdktable",
            partitionKey: {
                name: "pk",
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: "sk",
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            deletionProtection: false,
            pointInTimeRecovery: true,
            removalPolicy: RemovalPolicy.RETAIN,
        });
    });

    test('Table has correct properties', () => {
        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::DynamoDB::Table', {
            TableName: "dynamocdktable",
            BillingMode: "PAY_PER_REQUEST",
            KeySchema: [
                { AttributeName: "pk", KeyType: "HASH" },
                { AttributeName: "sk", KeyType: "RANGE" },
            ],
            AttributeDefinitions: [
                { AttributeName: "pk", AttributeType: "S" },
                { AttributeName: "sk", AttributeType: "S" },
            ],
            PointInTimeRecoverySpecification: {
                PointInTimeRecoveryEnabled: true,
            },
            DeletionProtectionEnabled: false,
        });
    });

    test('Table has correct removal policy', () => {
        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::DynamoDB::Table', 1);
        // Validate that the table is retained on stack deletion
        expect(stack.node.tryFindChild('dynamocdktable')?.node.defaultChild).toMatchObject({
            cfnOptions: {
                deletionPolicy: 'Retain',
            },
        });
    });
});
