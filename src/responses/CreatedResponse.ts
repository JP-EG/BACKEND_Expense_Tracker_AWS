import { BaseResponse } from "./BaseResponse";
import {Person} from "../person/Person";

export class CreatedResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
        value: Person, // The resource created or additional data to return
    ) {
        super({
            message: 'Created',
            type: 'https://development.JPEG/Created',
            title: 'The resource was successfully created.',
            detail: 'The operation completed successfully and the resource was created.',
            status: 201,
            instance,
            source: [],
            requestId,
            value, // Return the created resource or relevant data
        });
    }
}
