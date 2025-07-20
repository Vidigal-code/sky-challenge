import { Module } from '@nestjs/common';
import { AppLoggerService } from '../../services/loggers/logger.service';

@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
