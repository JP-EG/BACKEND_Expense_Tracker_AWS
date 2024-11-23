import {BaseResponse} from "./BaseResponse";

export class BadRequestResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
    ) {
        super({
            message: 'BadRequest',
            type: 'https://development.JPEG/BadRequest',
            title: 'The request could not be understood or was missing required parameters.',
            detail: 'The request could not be understood or was missing required parameters.',
            status: 400,
            instance,
            source: [],
            requestId,
            value: null,
        });
    }
}
