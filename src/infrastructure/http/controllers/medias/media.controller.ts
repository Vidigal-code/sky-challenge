import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Response } from 'express';
import { MediaService } from '@/application/services/medias/media.service';
import { CreateMediaDto } from '@/application/dtos/medias/create-media.dto';
import { MediaDomainExceptionFilter } from '@/infrastructure/filters/medias/media-domain-exception.filter';
import { LangDomainExceptionFilter } from '@/infrastructure/filters/langs/lang-domain-exception.filter';

@Controller('media')
@UseFilters(MediaDomainExceptionFilter, LangDomainExceptionFilter)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async create(
    @Body() createMediaDto: CreateMediaDto,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    const response = await this.mediaService.create(
      createMediaDto,
      req.url,
      req.method
    );
    res.status(response.statusCode).json(response);
  }

  @Get()
  async findAll(
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    const response = await this.mediaService.findAll(req.url, req.method);
    res.status(response.statusCode).json(response);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    const response = await this.mediaService.findOne(id, req.url, req.method);
    res.status(response.statusCode).json(response);
  }

  @Get('lang/:langCode')
  async findByLang(
    @Param('langCode') langCode: string,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    const response = await this.mediaService.findAllByLang(
      langCode,
      req.url,
      req.method
    );
    res.status(response.statusCode).json(response);
  }
}
