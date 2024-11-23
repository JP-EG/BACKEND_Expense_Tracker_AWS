import {BaseResponse} from "./BaseResponse";

export class OkResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
        person: object | string,
    ) {
        super({
            message: 'OK',
            type: 'https://development.JPEG/OK',
            title: 'The request has been processed successfully',
            detail: 'The request has been processed successfully',
            status: 200,
            instance,
            source: [],
            requestId,
            value: person,
        });
    }
}