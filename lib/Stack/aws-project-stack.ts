import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {AssetCode} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";

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
  }
}
