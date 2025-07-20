export abstract class LangDomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class LangNotFoundError extends LangDomainError {
  readonly code = 'LANG_NOT_FOUND';

  constructor(langCode?: string) {
    const message = langCode
      ? `Idioma com código '${langCode}' não encontrado`
      : 'Idioma não encontrado';
    super(message);
  }
}

export class LangAlreadyExistsError extends LangDomainError {
  readonly code = 'LANG_ALREADY_EXISTS';

  constructor() {
    super('Idioma já existe');
  }
}

export class LangInvalidDataError extends LangDomainError {
  readonly code = 'LANG_INVALID_DATA';

  constructor() {
    super('Dados do idioma inválidos');
  }
}

export class LangUnexpectedError extends LangDomainError {
  readonly code = 'LANG_UNEXPECTED_ERROR';

  constructor() {
    super('Erro inesperado ao processar o idioma');
  }
}
