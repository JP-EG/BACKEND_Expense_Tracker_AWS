import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const nodejsFunction = new NodejsFunction(
    //     this,
    //     "myFirstLambda",
    //     {
    //         entry: "./lib/resources/index.ts",
    //         handler: "lambda.handler",
    //         memorySize: 128,
    //         runtime: lambda.Runtime.NODEJS_LATEST,
    //         code: lambda.Code.fromAsset('resources'),
    //         bundling: {
    //             externalModules: [
    //                 'uuid'
    //             ]
    //       }
    //     }
    // )
  }
}
