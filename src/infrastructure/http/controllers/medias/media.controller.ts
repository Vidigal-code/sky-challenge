import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Res,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Response } from 'express';
import { MediaService } from '@/application/services/medias/media.service';
import { CreateMediaDto } from '@/application/dtos/medias/create-media.dto';
import { ResponseMapperMediaService } from '@/application/services/medias/response-mapper-media.service';
import { LangDomainError } from '@/domain/exceptions/langs/lang-domain.errors';
import { ResponseMapperLangService } from '@/application/services/langs/response-mapper-lang.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly responseMapperMediaService: ResponseMapperMediaService,
    private readonly responseMapperLangService: ResponseMapperLangService
  ) {}

  @Post()
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      const response = await this.mediaService.create(
        createMediaDto,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      const response = this.responseMapperMediaService.toErrorResponse(
        error,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    }
  }

  @Get()
  async findAll(
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      const response = await this.mediaService.findAll(req.url, req.method);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const response = this.responseMapperMediaService.toErrorResponse(
        error,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      const response = await this.mediaService.findOne(id, req.url, req.method);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const response = this.responseMapperMediaService.toErrorResponse(
        error,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    }
  }

  @Get('lang/:langCode')
  async findByLang(
    @Param('langCode') langCode: string,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      const response = await this.mediaService.findAllByLang(
        langCode,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      if (error instanceof LangDomainError) {
        const response = this.responseMapperLangService.toErrorResponse(
          error,
          req.url,
          req.method
        );
        res.status(response.statusCode).json(response);
      } else {
        const response = this.responseMapperMediaService.toErrorResponse(
          error,
          req.url,
          req.method
        );
        res.status(response.statusCode).json(response);
      }
    }
  }
}
