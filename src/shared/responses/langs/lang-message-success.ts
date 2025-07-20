import { SuccessResponse } from '@/shared/responses/responses.interface';
import { HttpStatus } from '@nestjs/common';

export class LangMessageSuccess {
  static created(
    langCode?: string,
    path: string = '',
    method: string = ''
  ): SuccessResponse<{ langCode?: string }> {
    const message = langCode
      ? `Idioma criado com sucesso. Código: ${langCode}`
      : 'Idioma criado com sucesso';
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message,
      data: langCode ? { langCode } : undefined,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static retrievedAll(path: string = '', method: string = ''): SuccessResponse {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Todos os idiomas foram recuperados com sucesso',
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static retrievedOne(
    langCode?: string,
    path: string = '',
    method: string = ''
  ): SuccessResponse {
    const message = langCode
      ? `Idioma com código '${langCode}' recuperado com sucesso`
      : 'Idioma recuperado com sucesso';
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message,
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static updated(path: string = '', method: string = ''): SuccessResponse {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Idioma atualizado com sucesso',
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }

  static deleted(path: string = '', method: string = ''): SuccessResponse {
    return {
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Idioma deletado com sucesso',
      timestamp: new Date().toISOString(),
      path,
      method,
    };
  }
}
