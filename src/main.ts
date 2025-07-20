import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const backendLogs =
    configService.get<string>('BACKEND_LOGS')?.toLowerCase() === 'true';
  app.useLogger(backendLogs ? ['log', 'warn', 'error'] : false);

  const port = configService.get<number>('BACKEND_PORT') || 3000;
  const host = configService.get<string>('BACKEND_HOST') || 'localhost';
  const httpsEnabled =
    configService.get<string>('BACKEND_HTTPS')?.toLowerCase() === 'true';

  await app.listen(port);

  function green(text: string): string {
    return `\x1b[32m${text}\x1b[0m`;
  }

  const protocol = httpsEnabled ? 'https' : 'http';

  console.log(
    green(
      `\nServidor rodando em ${protocol}://${host}:${port}, Criador por https://github.com/Vidigal-code`
    ),
    green('sky-challenge\n')
  );
}

bootstrap();
