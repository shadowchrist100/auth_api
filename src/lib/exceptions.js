import { Prisma } from '@prisma/client'
export class HttpException extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad Request", details = null) {
    super(400, message, details);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Conflict") {
    super(409, message);
  }
}

export class ValidationException extends HttpException {
  constructor(errors) {
    super(400, "Validation Failed", errors);
  }
}

export class PrismaException extends HttpException {
  constructor(errors) {
    if (errors instanceof Prisma.PrismaClientKnownRequestError) {

      switch (errors.code) {

        case 'P2002':
          super('Cette donnée existe déjà', 409);
          break;
          
        case 'P2001':
          super('Ressource introuvable', 404);
          break;

        case 'P2000':
          super('Valeur trop longue', 400);
          break;

        case 'P2005':
        case 'P2006':
          super('Valeur invalide', 400);
          break;

        case 'P2007':
          super('Données invalides', 400);
          break;

        case 'P2034':
          super('Conflit temporaire, veuillez réessayer', 409);
          break;

        case 'P1001':
          super('Service indisponible', 503);
          break;

        default:
          super('Erreur base de données', 500);
      }
    }
  }
}

