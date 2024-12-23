import {BaseResponse} from "./BaseResponse";
import {StatusCodes} from "http-status-codes";

export class InternalServerErrorResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
    ) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, {
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