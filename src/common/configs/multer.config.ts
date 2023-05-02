import * as dayjs from "dayjs";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import * as path from "path";

const storage = diskStorage({
    destination: (req, file, cb) =>{
        let type = req.originalUrl.split('/')[2];
        const uploadPath = `./uploads/${type}`;
        if(!existsSync(uploadPath)){
            mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) =>{
        let fileName = dayjs().format('YYYYMMDDHHmmss') + '-' + req['user']['_id'] + '-' + file.originalname;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) =>{
    //accept file
    let ext = path.extname(file.originalname);
    if(ext === '.jpg' || ext === '.jpeg' || ext === '.png'){
        cb(null, true);
    }
    //reject a file
    else{
        const error = new Error('Only accept JPEG or PNG image files');
        cb(error, false);
    }
}

export const multerOptions = {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
    },
    fileFilter: fileFilter
}