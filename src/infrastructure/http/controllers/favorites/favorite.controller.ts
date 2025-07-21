import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Request,
  Res,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Response } from 'express';
import { FavoriteService } from '@/application/services/favorites/favorite.service';
import { CreateFavoriteDto } from '@/application/dtos/favorites/create-favorite.dto';
import { ResponseMapperFavoriteService } from '@/application/services/favorites/response-mapper-favorite.service';

@Controller('users/:userId/favorites')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly responseMapperFavoriteService: ResponseMapperFavoriteService
  ) {}

  @Post()
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      await this.favoriteService.create(
        userId,
        createFavoriteDto,
        req.url,
        req.method
      );
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      const response = this.responseMapperFavoriteService.toErrorResponse(
        error,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    }
  }

  @Get()
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      const response = await this.favoriteService.findAll(
        userId,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      const response = this.responseMapperFavoriteService.toErrorResponse(
        error,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    }
  }

  @Delete(':mediaId')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      await this.favoriteService.remove(userId, mediaId, req.url, req.method);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      const response = this.responseMapperFavoriteService.toErrorResponse(
        error,
        req.url,
        req.method
      );
      res.status(response.statusCode).json(response);
    }
  }
}
