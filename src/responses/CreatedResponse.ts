import { BaseResponse } from "./BaseResponse";
import {Expense} from "../expense/Expense";
import {HttpStatusCode} from "axios";

export class CreatedResponse extends BaseResponse {
    constructor(
        instance: string,
        requestId: string,
        value: Expense,
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
            value,
        });
    }
}
