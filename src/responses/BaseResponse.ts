import { HttpStatusCode } from 'axios';

type MessageType = object | string | null;
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

    body: string;

    protected constructor(bodyProperties: BodyProperties) {
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

