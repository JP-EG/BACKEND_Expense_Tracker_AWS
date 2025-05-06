// lib/lambdas/lambda-factory.ts

import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

export class LambdaFactory extends Construct {
    public readonly getExpensesLambda: NodejsFunction;
    public readonly postExpenseLambda: NodejsFunction;
    public readonly putExpenseLambda: NodejsFunction;
    public readonly deleteExpenseLambda: NodejsFunction;

    constructor(scope: Construct, id: string, expenseTable: ITable) {
        super(scope, id);

        const commonEnv = {
            EXPENSE_TABLE_NAME: expenseTable.tableName,
            EXPENSE_TTL_TABLE: '3600',
        };

        this.getExpensesLambda = this.createLambda('getExpensesLambda', 'getExpensesLambda', commonEnv);
        this.postExpenseLambda = this.createLambda('postExpenseLambda', 'postExpenseLambda', commonEnv);
        this.putExpenseLambda = this.createLambda('putExpenseLambda', 'putExpenseLambda', commonEnv);
        this.deleteExpenseLambda = this.createLambda('deleteExpenseLambda', 'deleteExpenseLambda', commonEnv);
    }

    private createLambda(id: string, folderName: string, environment: Record<string, string>): NodejsFunction {
        return new NodejsFunction(this, id, {
            functionName: id,
            runtime: Runtime.NODEJS_20_X,
            memorySize: 128,
            handler: `src/${folderName}/index.handler`,
            timeout: Duration.seconds(30),
            code: new AssetCode(`dist/${folderName}`),
            environment,
        });
    }
}
