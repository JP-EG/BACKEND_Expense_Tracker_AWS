import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import PersonService from "../service/PersonService";
import { BadRequestResponse } from "../responses/BadRequestResponse";
import { CreatedResponse } from "../responses/CreatedResponse";
import { InternalServerErrorResponse } from "../responses/InternalServerErrorResponse";
import { Person } from "../person/Person";

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'body'> & {
    body: Person,
};

export type HandlerContext = Pick<Context, 'awsRequestId'>;

console.log('PUT_PERSON_LAMBDA');

const personService = new PersonService();

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
    console.log('PUT_PERSON_LAMBDA_HANDLER');
    console.log('Full event:', JSON.stringify(event, null, 2));
    const requestId = context.awsRequestId;
    console.log(`START`);

    try {
        if (!event.body) {
            const message = `Request body is missing.`;
            console.log(message);

            const response = new BadRequestResponse(`person`, requestId);
            console.log(`COMPLETE ${response}`);
            return response;
        }

        // Parse the body if it's a JSON string
        const personData: Person = JSON.parse(event.body);
        console.log(`Received person data: ${JSON.stringify(personData)}`);

        // Check if required fields are present in the personData
        if (!personData.personName || !personData.personAge) {
            const message = `Missing required fields: personName and personAge.`;
            console.log(message);

            const response = new BadRequestResponse(`person`, requestId);
            console.log(`COMPLETE ${response}`);
            return response;
        }

        // Save person data
        await personService.putPerson(personData);

        console.log(`COMPLETE`);
        return new CreatedResponse(`person/${personData.personName}`, requestId, personData);

    } catch (error) {
        console.error(error);

        const response = new InternalServerErrorResponse(`person`, requestId);
        console.log(`COMPLETE ${response}`);
        return response;
    }
};
