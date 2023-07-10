import * as winston from 'winston';
import * as path from 'path';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json, colorize, align} = winston.format;

const logFormat = winston.format.printf((info) =>{
    const { timestamp, level, message, metadata } = info; 
    let msgLog = `${timestamp} [${level}]: ${message}`;
    if(metadata){
        msgLog += JSON.stringify(metadata);
    }
    return msgLog;
})

const baseWinstonFormat = combine(
    timestamp({
        format: 'DD/MM/YYYY hh:mm:ss A'
    }),
    align(),
    logFormat
)

const winstonTransports = process.env.NODE_ENV === 'development' ?
    [
        new winston.transports.Console({
            format: combine(
                baseWinstonFormat,
                colorize({all: true})
            )
        }),
    ] : 
    [
        new winston.transports.Console({
            format: combine(
                baseWinstonFormat,
                colorize({all: true})
            )
        }),
        //log every level
        new DailyRotateFile({
            dirname: 'logs',
            filename: 'log_%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            maxSize: '10m',
            maxFiles: '14d',
            format: baseWinstonFormat
        }),
        //log error level
        new DailyRotateFile({
            dirname: 'logs/error',
            filename: 'log_error_%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            maxSize: '10m',
            maxFiles: '14d',
            format: baseWinstonFormat
        }),
    ]

export const winstonOptions ={
    level: process.env.LOG_LEVEL || 'info',
    transports: winstonTransports
    // transports:[
    //     //log every level
    //     new DailyRotateFile({
    //         dirname: 'log',
    //         filename: 'log_%DATE%.log',
    //         datePattern: 'DD-MM-YYYY',
    //         maxSize: '10m',
    //         maxFiles: '14d',
    //         format: baseWinstonFormat
    //     }),
    //     //log error level
    //     new DailyRotateFile({
    //         dirname: 'log/error',
    //         filename: 'log_error_%DATE%.log',
    //         datePattern: 'DD-MM-YYYY',
    //         maxSize: '10m',
    //         maxFiles: '14d',
    //         format: baseWinstonFormat
    //     }),
    //     // new winston.transports.File({
    //     //     // dirname: path.join(__dirname, '/log'),
    //     //     filename: 'log/log.log',
    //     //     format: baseWinstonFormat
    //     // }),
    //     // new winston.transports.File({
    //     //     filename: 'log/error/error.log',
    //     //     level: 'error',
    //     //     format: baseWinstonFormat
    //     // }),
    //     new winston.transports.Console({
    //         format: combine(
    //             baseWinstonFormat,
    //             colorize({all: true})
    //         )
    //     }),
    // ]
}