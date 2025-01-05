import { BaseResponse } from "./BaseResponse";
import {HttpStatusCode} from "axios";

export class CreatedResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
        expense: object | null,
    ) {
        super(HttpStatusCode.Created, {
            message: 'Created',
            type: 'https://development.JPEG/Created',
            title: 'The resource was successfully created.',
            detail: 'The operation completed successfully and the resource was created.',
            status: 201,
            instance,
            source: [],
            requestId,
            value: expense,
        });
    }
}
