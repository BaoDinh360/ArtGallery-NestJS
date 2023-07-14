import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('/api/file')
export class FileController {
    constructor(
        private fileService: FileService
    ){}
    @Get('/log')
    downloadLogFile(@Res() response : Response){
        const { file, filename } = this.fileService.downloadLogFile();
        response.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${filename}"`,
        })
        // file.pipe(response);
        response.send(file);
        
    }
}
