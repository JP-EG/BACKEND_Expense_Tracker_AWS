import * as cdk from 'aws-cdk-lib';
import {Duration, RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {AssetCode} from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {ProjectionType} from "aws-cdk-lib/aws-dynamodb";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {TableViewer} from "cdk-dynamo-table-viewer";
import {EndpointType, LambdaIntegration, MethodLoggingLevel, RestApi} from "aws-cdk-lib/aws-apigateway";

export class AwsProjectStack extends cdk.Stack {
  constructor(
      scope: Construct,
      id: string,
      props?: cdk.StackProps
  ) {
    super(scope, id, props);

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
        removalPolicy: RemovalPolicy.DESTROY,
      });

      // Add a Global Secondary Index (GSI) for querying by name
      personTable.addGlobalSecondaryIndex({
          indexName: "personName-index",
          partitionKey: {
              name: "personName",
              type: dynamodb.AttributeType.STRING,
          },
          projectionType: ProjectionType.ALL,
      });

      const getPersonLambda = new NodejsFunction(this, "getPersonLambda", {
          functionName: 'getPersonLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'src/getPersonLambda/index.handler', // Same structure but points to transpiled code
          bundling: {
              nodeModules: ['axios'], // Include axios here
          },
          timeout: Duration.seconds(30),
          code: new AssetCode('dist'), // Point to the transpiled output directory
          environment: {
              PERSON_TABLE_NAME: personTable.tableName,
              PERSON_TTL_TABLE: '3600',
          },
      });

      const putPersonLambda = new NodejsFunction(this, "putPersonLambda", {
          functionName: 'putPersonLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'src/putPersonLambda/index.handler', // Same structure but points to transpiled code
          bundling: {
              nodeModules: ['axios'], // Include axios here
          },
          timeout: Duration.seconds(30),
          code: new AssetCode('dist'), // Point to the transpiled output directory
          environment: {
              PERSON_TABLE_NAME: personTable.tableName,
              PERSON_TTL_TABLE: '3600',
          },
      });


      personTable.grantReadWriteData(getPersonLambda);
      personTable.grantReadWriteData(putPersonLambda);

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

      const person = apiGateway.root.addResource('person');

      person.addMethod('GET', new LambdaIntegration(getPersonLambda));

      const postPerson = apiGateway.root.addResource('put-person');
      postPerson.addMethod('PUT', new LambdaIntegration(putPersonLambda));

      new TableViewer(this, 'ViewPersonCounter', {
          title: 'Person Table',
          table: personTable,
      })
  }
}
