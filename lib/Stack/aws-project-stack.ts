import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {AssetCode} from "aws-cdk-lib/aws-lambda";

export class AwsProjectStack extends cdk.Stack {
  constructor(
      scope: Construct,
      id: string,
      props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const nodejsFunction = new NodejsFunction(this, "myFirstLambda", {
        functionName: 'myFirstLambda',
        runtime: lambda.Runtime.NODEJS_LATEST,
        memorySize: 128,
        handler: 'index.handler',
        timeout: Duration.seconds(30),
        code: new AssetCode(`./src/myFirstLambda`),
    });

    const table = new dynamodb.Table(this, "dynamocdktable", {
        tableName: "dynamocdktable",
        partitionKey: {
            name: "pk",
            type: dynamodb.AttributeType.STRING,
        },
        sortKey:{
            name:"sk",
            type:dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        deletionProtection: false,
        pointInTimeRecovery: true,
        removalPolicy: RemovalPolicy.RETAIN,
      });
  }
}
