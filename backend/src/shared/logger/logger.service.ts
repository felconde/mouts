import { Injectable, LoggerService as NestLoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, ...meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: any) {
    this.logger.verbose(message, { context, ...meta });
  }

  // Métodos específicos para diferentes tipos de operações
  logRequest(method: string, url: string, ip: string, userAgent?: string) {
    this.log(`HTTP ${method} ${url}`, 'HTTP', {
      method,
      url,
      ip,
      userAgent,
    });
  }

  logResponse(method: string, url: string, statusCode: number, responseTime: number) {
    const level = statusCode >= 400 ? 'warn' : 'info';
    this.logger.log(level, `HTTP ${method} ${url} - ${statusCode}`, {
      context: 'HTTP',
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
    });
  }

  logDatabase(operation: string, table: string, duration: number, meta?: any) {
    this.log(`Database ${operation} on ${table}`, 'DATABASE', {
      operation,
      table,
      duration: `${duration}ms`,
      ...meta,
    });
  }

  logAuth(action: string, userId?: string, email?: string, meta?: any) {
    this.log(`Authentication ${action}`, 'AUTH', {
      action,
      userId,
      email,
      ...meta,
    });
  }

  logCache(action: string, key: string, meta?: any) {
    this.log(`Cache ${action}`, 'CACHE', {
      action,
      key,
      ...meta,
    });
  }

  logError(error: Error, context?: string, meta?: any) {
    this.error(error.message, error.stack, context, {
      name: error.name,
      ...meta,
    });
  }
} 