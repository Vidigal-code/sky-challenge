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
  UseFilters,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Response } from 'express';
import { FavoriteService } from '@/application/services/favorites/favorite.service';
import { CreateFavoriteDto } from '@/application/dtos/favorites/create-favorite.dto';
import { FavoriteDomainExceptionFilter } from '@/infrastructure/filters/favorites/favorite-domain-exception.filter';

@Controller('users/:userId/favorites')
@UseFilters(FavoriteDomainExceptionFilter)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    await this.favoriteService.create(
      userId,
      createFavoriteDto,
      req.url,
      req.method
    );
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Get()
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    const response = await this.favoriteService.findAll(
      userId,
      req.url,
      req.method
    );
    res.status(response.statusCode).json(response);
  }

  @Delete(':mediaId')
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Request() req: ExpressRequest,
    @Res() res: Response
  ): Promise<void> {
    await this.favoriteService.remove(userId, mediaId, req.url, req.method);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
