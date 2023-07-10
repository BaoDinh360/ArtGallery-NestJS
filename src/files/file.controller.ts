import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('/api/file')
export class FileController {
    constructor(
        private fileService: FileService
    ){}
    @Get('/log/:logType')
    downloadLogFile(@Param('logType') logType: string, @Res() response : Response){
        const file = this.fileService.downloadLogFile(logType);
        response.contentType('text/plain');
        response.attachment();
        response.send(file);
    }
}
