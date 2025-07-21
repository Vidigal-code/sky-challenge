export abstract class FavoriteDomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class FavoriteNotFoundError extends FavoriteDomainError {
  readonly code = 'FAVORITE_NOT_FOUND';

  constructor() {
    super('Favorito não encontrado');
  }
}

export class FavoriteAlreadyExistsError extends FavoriteDomainError {
  readonly code = 'FAVORITE_ALREADY_EXISTS';

  constructor() {
    super('Favorito já existe');
  }
}

export class FavoriteUnexpectedError extends FavoriteDomainError {
  readonly code = 'FAVORITE_UNEXPECTED_ERROR';

  constructor() {
    super('Erro inesperado ao processar o favorito');
  }
}
