import {BaseResponse} from "./BaseResponse";
import {Expense} from "../expense/Expense";

export class OkResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
        person: Expense,
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