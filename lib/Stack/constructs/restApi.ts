// lib/resources/expense-api.ts

import { Construct } from 'constructs';
import {
    RestApi,
    EndpointType,
    MethodLoggingLevel,
    LambdaIntegration, Resource,
} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

export class ExpenseApi extends Construct {
    public readonly api: RestApi;

    constructor(scope: Construct, id: string, lambdas: {
        get: IFunction;
        post: IFunction;
        put: IFunction;
        delete: IFunction;
    }, addCorsOptions: (resource: Resource) => void) {
        super(scope, id);

        this.api = new RestApi(this, 'Expense-API', {
            restApiName: 'Expense-API',
            cloudWatchRole: false,
            deployOptions: {
                stageName: 'development',
                loggingLevel: MethodLoggingLevel.INFO,
            },
            endpointConfiguration: {
                types: [EndpointType.EDGE],
            },
        });

        const expense = this.api.root.addResource('expense');
        expense.addMethod('GET', new LambdaIntegration(lambdas.get));
        addCorsOptions(expense);

        const postExpense = this.api.root.addResource('add-expense');
        postExpense.addMethod('POST', new LambdaIntegration(lambdas.post));
        addCorsOptions(postExpense);

        const putExpense = this.api.root.addResource('update-expense');
        putExpense.addMethod('PUT', new LambdaIntegration(lambdas.put));
        addCorsOptions(putExpense);

        const deleteExpense = this.api.root.addResource('delete-expense');
        deleteExpense.addMethod('DELETE', new LambdaIntegration(lambdas.delete));
        addCorsOptions(deleteExpense);
    }
}
