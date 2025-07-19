import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {

    const app = await NestFactory.create(AppModule, {
        logger: process.env.BACKEND_LOGS === 'TRUE' ? ['error', 'warn', 'log'] : false,
    });

    const configService = app.get(ConfigService);
    const host = configService.get<string>('BACKEND_HOST', 'localhost');
    const port = configService.get<number>('BACKEND_PORT', 3000);
    const httpsEnabled = configService.get<boolean>('BACKEND_HTTPS', false);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    if (httpsEnabled) {
        Logger.log('HTTPS is disabled', 'Bootstrap');
    }

    await app.listen(port, host);
    Logger.log(`Application is running on http://${host}:${port}`, 'Bootstrap');
}

bootstrap();