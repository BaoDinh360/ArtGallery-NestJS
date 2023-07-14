import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as AdmZip from 'adm-zip';
import * as dayjs from 'dayjs';

@Injectable()
export class FileService {

    downloadLogFile(){
        try {
            // // const logPath = join(process.cwd(), 'log', logType, `${logType}.log`);
            // console.log(logPath);
            
            // const file = createReadStream(logPath);
            // // return new StreamableFile(file);
            // return file;

            const logZip = new AdmZip();
            const logDir = join(process.cwd(), 'logs');
            logZip.addLocalFolder(logDir);
            const logZipFilename = `log_${dayjs().format('DD-MM-YYYY')}.zip`;
            // const logZipFilePath = join(process.cwd(), 'logs', logZipFilename);

            // logZip.writeZip(logZipFilePath);
            // const logZipFile = createReadStream(logZipFilePath);
            const logZipFile = logZip.toBuffer();
            return {
                file: logZipFile,
                filename: logZipFilename
            };

        } catch (error) {
            throw error;
        }
    }
}
