import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import {Duration, RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {AssetCode} from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {TableViewer} from "cdk-dynamo-table-viewer";
import {EndpointType, LambdaIntegration, MethodLoggingLevel, RestApi} from "aws-cdk-lib/aws-apigateway";
import {addCorsOptions} from "./constructs/preFlightOptionsRequest";

export class AwsProjectStack extends cdk.Stack {
  constructor(
      scope: Construct,
      id: string,
      props?: cdk.StackProps
  ) {
    super(scope, id, props);

      const expenseTable = new dynamodb.Table(this, "ExpenseTable", {
          tableName: "ExpenseTable",
          partitionKey: {
              name: "userId",
              type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
              name: "expenseId",
              type: dynamodb.AttributeType.STRING,
          },
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
          deletionProtection: false,
          pointInTimeRecovery: true,
          removalPolicy: RemovalPolicy.DESTROY,
      });
      expenseTable.addGlobalSecondaryIndex({
          indexName: "expensesByDate-index",
          partitionKey: {
              name: "userId",
              type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
              name: "date",
              type: dynamodb.AttributeType.STRING,
          },
          projectionType: dynamodb.ProjectionType.ALL,
      });

      expenseTable.addGlobalSecondaryIndex({
         indexName: 'userId-index',
         partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
         projectionType: dynamodb.ProjectionType.ALL,
      });

      expenseTable.addGlobalSecondaryIndex({
          indexName: 'expenseId-index',
          partitionKey: { name: "expenseId", type: dynamodb.AttributeType.STRING },
          projectionType: dynamodb.ProjectionType.ALL,
      });

      expenseTable.addGlobalSecondaryIndex({
          indexName: 'userId-expenseId-index',
          partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
          sortKey: { name: "expenseId", type: dynamodb.AttributeType.STRING },
          projectionType: dynamodb.ProjectionType.ALL,
      });

      expenseTable.addGlobalSecondaryIndex({
          indexName: "expensesByCategory-index",
          partitionKey: {
              name: "userId",
              type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
              name: "category",
              type: dynamodb.AttributeType.STRING,
          },
          projectionType: dynamodb.ProjectionType.ALL,
      });

      const getExpensesLambda = new NodejsFunction(this, "getExpensesLambda", {
          functionName: 'getExpensesLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'src/getExpensesLambda/index.handler',
          timeout: Duration.seconds(30),
          code: new AssetCode('dist/getExpensesLambda'),
          environment: {
              EXPENSE_TABLE_NAME: expenseTable.tableName,
              EXPENSE_TTL_TABLE: '3600',
          },
      });

      const postExpenseLambda = new NodejsFunction(this, "postExpenseLambda", {
          functionName: 'postExpenseLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'src/postExpenseLambda/index.handler',
          timeout: Duration.seconds(30),
          code: new AssetCode('dist/postExpenseLambda'),
          environment: {
              EXPENSE_TABLE_NAME: expenseTable.tableName,
              EXPENSE_TTL_TABLE: '3600',
          },
      });

      const putExpenselambda = new NodejsFunction(this, "putExpenseLambda", {
         functionName: 'putExpenseLambda',
         runtime: lambda.Runtime.NODEJS_LATEST,
         memorySize: 128,
         handler: 'src/putExpenseLambda/index.handler',
         timeout: Duration.seconds(30),
         code: new AssetCode('dist/putExpenseLambda'),
         environment: {
             EXPENSE_TABLE_NAME: expenseTable.tableName,
             EXPENSE_TTL_TABLE: '3600',
         }
      });

      const deleteExpenseLambda = new NodejsFunction(this, 'deleteExpenseLambda', {
          functionName: 'deleteExpenseLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'src/deleteExpenseLambda/index.handler',
          timeout: Duration.seconds(30),
          code: new AssetCode('dist/deleteExpenseLambda'),
          environment: {
              EXPENSE_TABLE_NAME: expenseTable.tableName,
              EXPENSE_TTL_TABLE: '3600',
          },
      });

      expenseTable.grantReadData(getExpensesLambda);
      expenseTable.grantWriteData(postExpenseLambda);
      expenseTable.grantReadWriteData(putExpenselambda);

      deleteExpenseLambda.addToRolePolicy(
          new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['dynamodb:DeleteItem'],
              resources: [
                  `arn:aws:dynamodb:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:table/${expenseTable.tableName}`
              ],
          })
      );

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

      const expense = apiGateway.root.addResource('expense');
      expense.addMethod('GET', new LambdaIntegration(getExpensesLambda));
      addCorsOptions(expense);

      const postExpense = apiGateway.root.addResource('add-expense');
      postExpense.addMethod('POST', new LambdaIntegration(postExpenseLambda));
      addCorsOptions(postExpense);

      const putExpense = apiGateway.root.addResource('update-expense');
      putExpense.addMethod('PUT', new LambdaIntegration(putExpenselambda));
      addCorsOptions(putExpense);

      const deleteExpense = apiGateway.root.addResource('delete-expense');
      deleteExpense.addMethod('DELETE', new LambdaIntegration(deleteExpenseLambda));
      addCorsOptions(deleteExpense);

      new TableViewer(this, 'ViewExpenseTable', {
          title: 'Expense Table',
          table: expenseTable,
      });
  }
}
