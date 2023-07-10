import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {

    downloadLogFile(logType: string){
        try {
            const logPath = join(process.cwd(), 'log', logType, `${logType}.log`);
            console.log(logPath);
            
            const file = createReadStream(logPath);
            // return new StreamableFile(file);
            return file;
        } catch (error) {
            throw error;
        }
    }
}
