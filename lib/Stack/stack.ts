import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import {Construct} from 'constructs';
import {addCorsOptions} from "./constructs/preFlightOptionsRequest";
import {LambdaFactory} from "./constructs/lambda";
import {ExpenseApi} from "./constructs/restApi";
import {ExpenseTable} from "./constructs/dynamo";

export class Stack extends cdk.Stack {
  constructor(
      scope: Construct,
      id: string,
      props?: cdk.StackProps
  ) {
    super(scope, id, props);

      const expenseTableConstruct = new ExpenseTable(this, 'ExpenseTableConstruct');
      const expenseTable = expenseTableConstruct.table;

      const lambdas = new LambdaFactory(this, 'LambdaFactory', expenseTable);
      const getExpensesLambda = lambdas.getExpensesLambda;
      const putExpenseLambda = lambdas.putExpenseLambda;
      const deleteExpenseLambda = lambdas.deleteExpenseLambda;
      const postExpenseLambda = lambdas.postExpenseLambda;

      expenseTable.grantReadData(getExpensesLambda);
      expenseTable.grantWriteData(postExpenseLambda);
      expenseTable.grantReadWriteData(putExpenseLambda);

      deleteExpenseLambda.addToRolePolicy(
          new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['dynamodb:DeleteItem'],
              resources: [
                  `arn:aws:dynamodb:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:table/${expenseTable.tableName}`
              ],
          })
      );

      new ExpenseApi(this, 'ExpenseApi', {
          get: lambdas.getExpensesLambda,
          post: lambdas.postExpenseLambda,
          put: lambdas.putExpenseLambda,
          delete: lambdas.deleteExpenseLambda,
      }, addCorsOptions);
  }
}
