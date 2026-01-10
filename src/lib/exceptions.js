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
        let message = 'Erreur serveur interne';
        let statusCode = 500;

        if (errors instanceof Prisma.PrismaClientKnownRequestError) {
            switch (errors.code) {
                case 'P2002':
                    message = 'Cette donnée existe déjà';
                    statusCode = 409;
                    break;
                case 'P2001':
                    message = 'Ressource introuvable';
                    statusCode = 404;
                    break;
                case 'P2000':
                    message = 'Valeur trop longue';
                    statusCode = 400;
                    break;
                case 'P2006':
                    message = 'Valeur invalide';
                    statusCode = 400 ;
                case 'P2007':
                    message = 'Donnees invalides';
                    statusCode = 400;
                case 'P2034':
                    message = 'Conflit temporaire, veillez réessayez';
                    statusCode = 409;
                default:
                    message = 'Erreur base de données';
                    statusCode = 500;
            }
        }

        super(message, statusCode);
    }
}

