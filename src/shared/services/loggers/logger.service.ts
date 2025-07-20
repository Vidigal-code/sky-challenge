import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private logger = new Logger('AppLoggerService');

  log(message: string, context?: any) {
    this.logger.log(
      context ? `${message} | Context: ${JSON.stringify(context)}` : message
    );
  }

  warn(message: string, context?: any) {
    this.logger.warn(
      context ? `${message} | Context: ${JSON.stringify(context)}` : message
    );
  }

  error(message: string, error: unknown, context?: any) {
    let errorStack = '';
    if (error instanceof Error) {
      errorStack = error.stack || error.message;
    } else {
      errorStack = String(error);
    }
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    this.logger.error(`${message}${contextStr}`, errorStack);
  }
}