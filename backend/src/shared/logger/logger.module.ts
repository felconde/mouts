import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { LoggerService } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { AllExceptionsFilter } from './exception.filter';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        level: configService.get('LOG_LEVEL') || 'info',
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        ),
        defaultMeta: { service: 'users-api' },
        transports: [
          // Console transport
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            ),
          }),
          // File transport for errors
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          // File transport for all logs
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoggerService, LoggingInterceptor, AllExceptionsFilter],
  exports: [LoggerService, LoggingInterceptor, AllExceptionsFilter],
})
export class LoggerModule {} 