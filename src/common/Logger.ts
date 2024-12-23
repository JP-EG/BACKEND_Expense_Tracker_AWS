export class Logger {
    private readonly _loggerName: string;

    constructor(loggerName: string){
        this._loggerName = loggerName;
    }

    get loggerName(): string{
        return this._loggerName;
    }

    public info(message: string, context: object | undefined = undefined): void {
        console.info({
            logger: this._loggerName,
            message,
            context: {
                ...context,
            },
        });
    }

    public warn(message: string, context: object | undefined = undefined): void {
        console.warn({
            logger: this._loggerName,
            message,
            context: {
                ...context,
            },
        });
    }

    public error(error: unknown, message?: string): void {
        console.error({
            logger: this._loggerName,
            error,
            message,
        })
    }
}