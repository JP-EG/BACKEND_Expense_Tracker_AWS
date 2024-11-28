import {AssetCode, Function, Runtime} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";
import {Construct} from "constructs";

type NodeLambdaProps = {
    name: string;
    lambdaSourcePath: string;
    environment?: { [p: string]: string | undefined };
}

export class NodeLambdaFunction extends Function {
    constructor(scope: Construct, id: string, props: NodeLambdaProps) {
        super(scope, id, {
            functionName: `${props.name}-${props.environment}`,
            runtime: Runtime.NODEJS_LATEST,
            code: new AssetCode(`${props.lambdaSourcePath}/${props.name}`),
            memorySize: 128,
            handler: 'index.handler',
            timeout: Duration.seconds(30),
        });
    }
}