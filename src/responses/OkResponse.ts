import { StatusCodes } from "http-status-codes";
import {BaseResponse} from "./BaseResponse";

export class OkResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
        expense: object[] | null,
    ) {
        super(StatusCodes.OK, {
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