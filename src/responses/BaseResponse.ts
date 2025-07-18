import {HttpStatusCode} from "axios";

type MessageType = object | string | null;
type BaseResponseHeaders = {
    'Content-Type': string,
    'Access-Control-Allow-Origin': string,
    'Access-Control-Allow-Methods': string,
    'Access-Control-Allow-Headers': string,
    'Access-Control-Allow-Credentials': boolean
}
type BodyProperties = {
    message: MessageType;
    type: MessageType;
    title: MessageType;
    detail: MessageType;
    status: number;
    instance: MessageType;
    source: MessageType;
    value: MessageType;
    requestId: object | string;
}

export abstract class BaseResponse {
    statusCode: HttpStatusCode;
    headers: BaseResponseHeaders;

    body: string;

    protected constructor(status: HttpStatusCode, bodyProperties: BodyProperties) {
        this.statusCode = status;
        this.headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
            'Access-Control-Allow-Credentials': true,
        };
        this.body = JSON.stringify({
            message: bodyProperties.message,
            type: bodyProperties.type,
            title: bodyProperties.title,
            detail: bodyProperties.detail,
            status: bodyProperties.status,
            instance: bodyProperties.instance,
            source: bodyProperties.source,
            requestId: bodyProperties.requestId,
            value: bodyProperties.value,
        });
    }
}

