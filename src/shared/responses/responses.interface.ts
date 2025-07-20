import { HttpStatus } from '@nestjs/common';

export interface SuccessResponse<T = any> {
  success: boolean;
  statusCode: HttpStatus;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
  method: string;
}

export interface ErrorResponse {
  success: boolean;
  statusCode: HttpStatus;
  error: string;
  message: string;
  code?: string;
  timestamp: string;
  path: string;
  method: string;
  details?: any;
}