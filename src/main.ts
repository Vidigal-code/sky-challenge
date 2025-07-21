import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FavoriteDomainExceptionFilter } from '@/infrastructure/filters/favorites/favorite-domain-exception.filter';
import { ResponseMapperFavoriteService } from '@/application/services/favorites/response-mapper-favorite.service';
import { MediaDomainExceptionFilter } from '@/infrastructure/filters/medias/media-domain-exception.filter';
import { ResponseMapperMediaService } from '@/application/services/medias/response-mapper-media.service';
import { LangDomainExceptionFilter } from '@/infrastructure/filters/langs/lang-domain-exception.filter';
import { ResponseMapperLangService } from '@/application/services/langs/response-mapper-lang.service';

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

  app.useGlobalFilters(
    new FavoriteDomainExceptionFilter(app.get(ResponseMapperFavoriteService)),
    new MediaDomainExceptionFilter(app.get(ResponseMapperMediaService)),
    new LangDomainExceptionFilter(app.get(ResponseMapperLangService))
  );

  function blue(text: string): string {
    return `\x1b[34m${text}\x1b[0m`;
  }

  const protocol = httpsEnabled ? 'https' : 'http';

  console.log(
    blue(
      `\nServidor rodando em ${protocol}://${host}:${port}, Criador por https://github.com/Vidigal-code`
    ),
    blue('sky-challenge\n')
  );
}

bootstrap();
