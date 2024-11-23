import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import PersonService from "../service/PersonService";
import { NotFoundResponse } from "../responses/NotFoundResponse";
import { OkResponse } from "../responses/OkResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: {
        personName: string,
    }
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

console.log('GET_PERSON_LAMBDA');

const personService = new PersonService();

export const handler = async (event: HandlerEvent, context: Context) => {
    console.log('GET_PERSON_LAMBDA_HANDLER');
    const { personName } = event.queryStringParameters;
    console.log(`START: Fetching person with name ${personName}`);
    const requestId = context.awsRequestId;

    try {
        const person = await personService.getPersonByName(personName);
        console.log(`Person from dynamo = ${person}`)
        if (!person) {
            const message = `Name not found: ${personName}`;
            console.log(message);

            const response = new NotFoundResponse(`person/${personName}`, requestId);
            console.log(`COMPLETE ${JSON.stringify(response)}`);
            return response;
        }

        console.log(`COMPLETE`);
        return new OkResponse(`person/${personName}`, requestId, person);

    } catch (error) {
        console.error(error);

        const response = new InternalServerErrorResponse(`person/${personName}`, requestId);
        console.log(`COMPLETE ${JSON.stringify(response)}`);
        return response;
    }
};

