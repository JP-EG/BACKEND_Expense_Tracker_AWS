import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Duration } from 'aws-cdk-lib';

describe('MyFirstLambda', () => {
    let stack: cdk.Stack;

    beforeEach(() => {
        stack = new cdk.Stack();
        new NodejsFunction(stack, "getPersonLambda", {
            functionName: 'getPersonLambda',
            runtime: lambda.Runtime.NODEJS_LATEST,
            memorySize: 128,
            handler: 'index.handler',
            timeout: Duration.seconds(30),
            code: lambda.Code.fromAsset('./src/getPersonLambda'),
        });
    });

    test('Lambda function has correct properties', () => {
        const template = Template.fromStack(stack);

        template.hasResourceProperties('AWS::Lambda::Function', {
            FunctionName: 'getPersonLambda',
            Runtime: 'nodejs18.x',
            Handler: 'index.handler',
            MemorySize: 128,
            Timeout: 30,
        });
    });

    test('Lambda resource is created', () => {
        const template = Template.fromStack(stack);

        // Ensure there is exactly one Lambda function
        template.resourceCountIs('AWS::Lambda::Function', 1);
    });
});
