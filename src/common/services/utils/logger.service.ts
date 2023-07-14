import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class LoggerService{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger : Logger
    ){}

    formatApiInfo(request: any): string{
        const { ip, method, originalUrl, protocol } = request;
        const fullUrl = `${protocol}://${request.get('Host')}${originalUrl}`;
        return `${[method]} ${fullUrl} - ${ip}`;
    }

    formatResponseStatusCode(statusCode): string{
        return `${statusCode}-${HttpStatus[statusCode]}`;
    }

    logInfo(message: string): void{
        this.winstonLogger.info(message);
    }
    logError(message: string): void{
        this.winstonLogger.error(message);
    }
    logDebug(message: string): void{
        this.winstonLogger.debug(message);
    }
    logVerbose(message: string): void{
        this.winstonLogger.verbose(message);
    }
    log(level: string, message: string): void{
        this.winstonLogger.log(level, message);
    }
}