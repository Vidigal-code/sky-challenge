import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
  private getLogger(context?: string): Logger {
    const combinedContext = context
      ? `${context} AppLoggerService`
      : 'AppLoggerService';
    return new Logger(combinedContext);
  }

  log(message: string, context?: string) {
    this.getLogger(context).log(message);
  }

  warn(message: string, context?: string) {
    this.getLogger(context).warn(message);
  }

  error(message: string, error: unknown, context?: string) {
    let errorStack = '';
    if (error instanceof Error) {
      errorStack = error.stack || error.message;
    } else {
      errorStack = String(error);
    }
    this.getLogger(context).error(message, errorStack);
  }
}
