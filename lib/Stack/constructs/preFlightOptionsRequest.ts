import { MockIntegration, PassthroughBehavior, Resource } from 'aws-cdk-lib/aws-apigateway';

export const addCorsOptions = (apiResource: Resource)=> {
    apiResource.addMethod(
        'OPTIONS',
        new MockIntegration({
            integrationResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,Authorization'",
                        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,POST,PUT,DELETE'",
                        'method.response.header.Access-Control-Allow-Origin': "'*'",
                    },
                },
            ],
            passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
            requestTemplates: {
                'application/json': '{"statusCode": 200}',
            },
        }),
        {
            methodResponses: [
                {
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                    },
                },
            ],
        }
    );
};
