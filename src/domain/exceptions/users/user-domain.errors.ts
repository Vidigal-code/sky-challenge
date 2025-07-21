export abstract class UserDomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundError extends UserDomainError {
  readonly code = 'USER_NOT_FOUND';

  constructor(id: number) {
    super(`Usuário com ID ${id} não encontrado`);
  }
}
