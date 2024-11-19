import {HttpStatusCode} from "axios";
import {BaseResponse} from "./BaseResponse";

export class InternalServerErrorResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
    ) {
        super(HttpStatusCode.InternalServerError, {
            message: 'InternalServerError',
            type: 'https://development.JPEG/InternalServerError',
            title: 'An unexpected server error occurred on the server',
            detail: 'An unexpected server error occurred on the server',
            status: 500,
            instance,
            source: [],
            requestId,
            value: null,
        });
    }
}