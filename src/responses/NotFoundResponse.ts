import {BaseResponse} from "./BaseResponse";
import {HttpStatusCode} from "axios";

export class NotFoundResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
    ) {
        super(HttpStatusCode.NotFound, {
            message: 'NotFound',
            type: 'https://development.JPEG/NotFound',
            title: 'The request resource could not be found',
            detail: 'The request resource could not be found',
            status: 404,
            instance,
            source: [],
            requestId,
            value: null,
        });
    }
}