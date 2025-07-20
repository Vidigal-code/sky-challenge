import { SuccessResponse } from '@/shared/responses/responses.interface';
import { HttpStatus } from '@nestjs/common';

export class MediaMessageSuccess {
  static created(
    id?: number,
    path: string = '',
    method: string = ''
  ): SuccessResponse<{ id?: number }> {
    const message = id
      ? `Mídia criada com sucesso. ID: ${id}`
      : 'Mídia criada com sucesso';
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message,
      data: id ? { id } : undefined,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static retrievedAll(path: string = '', method: string = ''): SuccessResponse {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Todas as mídias foram recuperadas com sucesso',
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static retrievedOne(
    id?: number,
    path: string = '',
    method: string = ''
  ): SuccessResponse {
    const message = id
      ? `Mídia com ID ${id} recuperada com sucesso`
      : 'Mídia recuperada com sucesso';
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static retrievedByLang(
    lang: string,
    path: string = '',
    method: string = ''
  ): SuccessResponse {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: `Mídias no idioma '${lang}' recuperadas com sucesso`,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static updated(path: string = '', method: string = ''): SuccessResponse {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Mídia atualizada com sucesso',
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static deleted(path: string = '', method: string = ''): SuccessResponse {
    return {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Mídia deletada com sucesso',
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }
}
