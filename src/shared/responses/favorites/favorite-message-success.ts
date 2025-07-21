import { HttpStatus } from '@nestjs/common';
import { SuccessResponse } from '@/shared/responses/responses.interface';

export class FavoriteMessageSuccess {
  static created(
    userId: number,
    path: string,
    method: string
  ): SuccessResponse<unknown> {
    return {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: `Favorito adicionado com sucesso para o usuário ${userId}`,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static retrievedAll(
    userId: number,
    path: string,
    method: string
  ): SuccessResponse<unknown> {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Favoritos recuperados com sucesso para o usuário ${userId}`,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static removed(
    userId: number,
    mediaId: number,
    path: string,
    method: string
  ): SuccessResponse<unknown> {
    return {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: `Favorito removido com sucesso para o usuário ${userId} e mídia ${mediaId}`,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }
}
