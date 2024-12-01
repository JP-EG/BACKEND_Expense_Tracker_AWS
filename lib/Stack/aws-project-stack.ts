import * as cdk from 'aws-cdk-lib';
import {Duration, RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {AssetCode} from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
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

      const expenseTable = new dynamodb.Table(this, "ExpenseTable", {
          tableName: "ExpenseTable",
          partitionKey: {
              name: "userId", // Each user will have their own partition
              type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
              name: "expenseId", // Unique identifier for each expense
              type: dynamodb.AttributeType.STRING,
          },
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
          deletionProtection: false,
          pointInTimeRecovery: true,
          removalPolicy: RemovalPolicy.DESTROY,
      });

      const budgetTable = new dynamodb.Table(this, "BudgetTable", {
          tableName: "BudgetTable",
          partitionKey: {
              name: "userId",
              type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
              name: "category",
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
              name: "userId", // Keep the partition key as userId
              type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
              name: "date", // Sort by the expense date
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
              name: "userId", // Keep the partition key as userId
              type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
              name: "category", // Sort by the expense category
              type: dynamodb.AttributeType.STRING,
          },
          projectionType: dynamodb.ProjectionType.ALL,
      });

      const getExpensesLambda = new NodejsFunction(this, "getExpensesLambda", {
          functionName: 'getExpensesLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'src/getExpensesLambda/index.handler', // Update handler path
          timeout: Duration.seconds(30),
          code: new AssetCode('dist'),
          environment: {
              EXPENSE_TABLE_NAME: expenseTable.tableName,
              EXPENSE_TTL_TABLE: '3600',
          },
      });

      const putExpenseLambda = new NodejsFunction(this, "putExpenseLambda", {
          functionName: 'putExpenseLambda',
          runtime: lambda.Runtime.NODEJS_LATEST,
          memorySize: 128,
          handler: 'src/putExpenseLambda/index.handler', // Update handler path
          timeout: Duration.seconds(30),
          code: new AssetCode('dist'), // Ensure transpiled code is in 'dist'
          environment: {
              EXPENSE_TABLE_NAME: expenseTable.tableName,
              EXPENSE_TTL_TABLE: '3600',
          },
      });

      expenseTable.grantReadData(getExpensesLambda);
      expenseTable.grantWriteData(putExpenseLambda);

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


      const putExpense = apiGateway.root.addResource('add-expense');
      putExpense.addMethod('PUT', new LambdaIntegration(putExpenseLambda));

      new TableViewer(this, 'ViewExpenseTable', {
          title: 'Expense Table',
          table: expenseTable,
      });
  }
}
