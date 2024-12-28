import {BaseResponse} from "./BaseResponse";
import {HttpStatusCode} from "axios";

export class OkResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
        expense: object[] | null,
    ) {
        super(HttpStatusCode.Ok, {
            message: 'OK',
            type: 'https://development.JPEG/OK',
            title: 'The request has been processed successfully',
            detail: 'The request has been processed successfully',
            status: 200,
            instance,
            source: [],
            requestId,
            value: expense,
        });
    }
}