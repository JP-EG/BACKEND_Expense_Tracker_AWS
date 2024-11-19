import * as cdk from 'aws-cdk-lib';
import {Duration, RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {AssetCode} from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {EndpointType, LambdaIntegration, MethodLoggingLevel, RestApi} from "aws-cdk-lib/aws-apigateway";

export class AwsProjectStack extends cdk.Stack {
  constructor(
      scope: Construct,
      id: string,
      props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const getPersonLambda = new NodejsFunction(this, "getPersonLambda", {
        functionName: 'getPersonLambda',
        runtime: lambda.Runtime.NODEJS_LATEST,
        memorySize: 128,
        handler: 'index.handler',
        timeout: Duration.seconds(30),
        code: new AssetCode(`./src/getPersonLambda`),
    });

      const postPersonLambda = new NodejsFunction(this, "postPersonLambda", {
          functionName: 'postPersonLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'index.handler',
          timeout: Duration.seconds(30),
          code: new AssetCode(`./src/postPersonLambda`),
      });

      const apiGateway = new RestApi(this, 'JPEG-API', {
         restApiName: 'JPEG-API',
         cloudWatchRole: false,
         deployOptions: {
             stageName: 'development',
             loggingLevel: MethodLoggingLevel.INFO,
         },
          endpointConfiguration: {
             types: [EndpointType.EDGE],
          },
      });

      const getPerson = apiGateway.root.addResource('person');
      const getPersonByName = getPerson.addResource('{name}');
      getPersonByName.addMethod('GET', new LambdaIntegration(getPersonLambda));

      const postPerson = apiGateway.root.addResource('post-person');
      postPerson.addMethod('POST', new LambdaIntegration(postPersonLambda));

    const personTable = new dynamodb.Table(this, "personTable", {
        tableName: "personTable",
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
