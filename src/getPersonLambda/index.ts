import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import PersonService from "../service/PersonService";
import {NotFoundResponse} from "../responses/NotFoundResponse";
import {OkResponse} from "../responses/OkResponse";
import {InternalServerErrorResponse} from "../responses/InternalServerErrorResponse";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'pathParameters'> & {
    pathParameters: {
        name: string,
    }
}

export type HandlerContext = Pick<Context, 'awsRequestId'>;
console.log('GET_PERSON_LAMBDA');

const personService = new PersonService();

export const handler = async (event: HandlerEvent, context: Context) => {
    console.log('GET_PERSON_LAMBDA_HANDLER');
    const name = event.pathParameters.name;
    const requestId = context.awsRequestId;
    console.log(`START ${name}`)
    try {
        const person = await personService.getPersonByName(name);

        if(!person) {
            const message = `Name not found for ${name}`;
            console.log(message);

            const response = new NotFoundResponse(`person/${name}`, requestId);
            console.log(`COMPLETE ${response}`)
            return response;
        }

        console.log(`COMPLETE`);
        return new OkResponse(`person/${name}`, requestId, person);

    } catch (error) {
        console.log(error);

        const response = new InternalServerErrorResponse(`person/${name}`, requestId);
        console.log(`COMPLETE ${response}`)
        return response;
    }
};