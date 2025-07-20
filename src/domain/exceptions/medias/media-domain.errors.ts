export abstract class MediaDomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MediaNotFoundError extends MediaDomainError {
  readonly code = 'MEDIA_NOT_FOUND';

  constructor(id?: number) {
    const message = id
      ? `Mídia com ID ${id} não encontrada`
      : 'Mídia não encontrada';
    super(message);
  }
}

export class MediaAlreadyExistsError extends MediaDomainError {
  readonly code = 'MEDIA_ALREADY_EXISTS';

  constructor() {
    super('Mídia já existe');
  }
}

export class MediaInvalidDataError extends MediaDomainError {
  readonly code = 'MEDIA_INVALID_DATA';

  constructor() {
    super('Dados da mídia inválidos');
  }
}

export class MediaUnexpectedError extends MediaDomainError {
  readonly code = 'MEDIA_UNEXPECTED_ERROR';

  constructor() {
    super('Erro inesperado ao processar a mídia');
  }
}
