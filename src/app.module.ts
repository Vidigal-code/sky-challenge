import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST || '0.0.0.0',
            port: parseInt(process.env.POSTGRES_PORT) || 5432,
            username: process.env.POSTGRES_USER || 'vidigal',
            password: process.env.POSTGRES_PASSWORD || 'test1234',
            database: process.env.POSTGRES_DB || 'media_db',
            synchronize: true,
        }),
    ],
})
export class AppModule {}