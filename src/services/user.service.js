import prisma from "#lib/prisma";
import { generateAccessToken, createRefreshToken, verifyRefreshToken } from "#lib/jwt";
import { hashPassword, verifyPassword } from "#lib/password";
import { ConflictException, UnauthorizedException, NotFoundException } from "#lib/exceptions";
import { UserDto } from "#dto/user.dto";
import crypto from 'node:crypto';
import { EmailService } from "#services/email.service";
import jwt from 'jsonwebtoken'
import { verifyTwoFactorToken } from "#services/twofactor.service";

export class UserService {
    static async verifyEmail(email, code) {
        const user = await this.findByEmail(email)

        if (!user || user.emailVerifyToken != code) {
            console.error("code: ", code, "verifCode: ", user.emailVerifyToken);

            throw new UnauthorizedException("Utilisateur non authentifié ou code invalide")
        }

        return await prisma.user.update({
            where: { email },
            data: {
                emailVerifiedAt: new Date(),
                emailVerifyToken: null
            }
        })
    }
    // Inscription 
    static async register(data) {
        const { email, password, firstName, lastName } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException("Email déjà utilisé");
        }

        const hashedPassword = await hashPassword(password);

        const emailVerifyToken = crypto.randomBytes(512).toString("hex");
        const expiresAt = new Date(Date.now() + 900000); // 15min

        // envoyer un mail pour vérifer le mail 
        const url = `http://localhost:3000/auth/emailVerification?code=${emailVerifyToken}&email=${email}`;
        await EmailService.sendEmail(email, "Email Verification", `<a href=${url}>Cliquer sur ce lien pour vérifier votre email</a>`);
        // on cree l'utilisateur sans  vérifier l'email
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                emailVerifyToken,
                expiresAt
            },
        })
    }

    // Connexion
    static async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await verifyPassword(user.password, password))) {
            throw new UnauthorizedException("Identifiants invalides");
        }
        
        if (user.twoFactorEnabledAt) {
        return {
            twoFactorRequired: true,
            userId: user.id,
            message: "Double authentification requise"
         };
        }

        const accessToken = await generateAccessToken({
            id: user.id,
            email: user.email
        });

        const refreshToken = await createRefreshToken(user.id);

        return {
            user: new UserDto(user),
            accessToken,
            refreshToken
        };
    }

    //connexion 2fa
    static async verifyLogin2FA(userId, token) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFactorSecret) {
        throw new UnauthorizedException("Action non autorisée ou 2FA non configurée");
    }

    const isValid = verifyTwoFactorToken(token, user.twoFactorSecret);

    if (!isValid) {
        throw new UnauthorizedException("Code 2FA invalide ou expiré");
    }

    
    const accessToken = await generateAccessToken({
        id: user.id,
        email: user.email
    });

    const refreshToken = await createRefreshToken(user.id);

    return {
        user: new UserDto(user),
        accessToken,
        refreshToken
    };
}

    // 3. Inscription via GitHub (OAuth)
    static async registerGithubUser(userData) {
        const { email, name, id } = userData;
        const nameParts = name.split(' ');
        const lastName = nameParts[0];
        const firstName = nameParts.slice(1).join(' ') || '';

        return prisma.user.create({
            data: {
                email: email,
                lastName: lastName,
                firstName: firstName,
                oauthAccounts: {
                    create: {
                        provider: 'GitHub',
                        providerId: String(id),
                    }
                }
            }
        });
    }

    // 4. Connexion via GitHub
    static async loginGithubUser(user) {
        const accessToken = await generateAccessToken({
            id: user.id,
            email: user.email
        });

        const refreshToken = await createRefreshToken(user.id);

        return {
            user: new UserDto(user),
            accessToken,
            refreshToken
        };
    }

    static async registerGithubUser(userData) {
        const { email, name, id } = userData;
        const lastName = name.split(' ')[0];
        const firstName = name.split(' ')[1];

        return prisma.user.create({
            data: {
                email: email,
                lastName: lastName,
                firstName: firstName,
                oauthAccounts: {
                    create: {
                        provider: 'GitHub',
                        providerId: String(id),
                    }
                }
            }
        })
    }

    static async saveLoginHistory(userId, data) {
        return prisma.loginHistory.create({
            data: {
                userId,
                ip: data.ip,
                userAgent: data.userAgent,
            },
        });
    }

    // 5. Utilitaires de recherche
    static async findAll() {
        return prisma.user.findMany();
    }

    static async findById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException("Utilisateur non trouvé");
        return user;
    }

    static async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }

    // 6. Gestion des Tokens (Refresh & Logout)
    static async refresh(token) {
        const storedToken = await verifyRefreshToken(token);
        if (!storedToken) {
            throw new UnauthorizedException("Refresh Token invalide ou expiré");
        }

        // 1. Générer le nouvel Access Token
        const accessToken = await generateAccessToken({
            id: storedToken.user.id,
            email: storedToken.user.email
        });

        //on utilise une transaction pour invalider l'ancien et créer le nouveau Refresh Token
        const newRefreshToken = await prisma.$transaction(async (tx) => {

            await tx.refreshToken.update({
                where: { token: token },
                data: { revokedAt: new Date() }
            });

            // Créer un nouveau Refresh Token
            const tokenString = crypto.randomBytes(512).toString("hex");
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            return await tx.refreshToken.create({
                data: {
                    token: tokenString,
                    userId: storedToken.user.id,
                    expiresAt,
                },
            });
        });
        return {
            accessToken,
            refreshToken: newRefreshToken.token // On récupère la propriété .token de l'objet retourné
        };
    }

    static async logout(refreshToken, accessToken) {
        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
                revokedAt: null
            }
        });
        if (!storedToken) {
            throw new UnauthorizedException("Ce refresh token est invalide ou déjà révoqué");
        }

        await prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() }
        });
        if (accessToken) {
            const decoded = jwt.decode(accessToken); // decoder le token pour lire sa vraie date d'expiration
            const expiryDate = new Date(decoded.exp * 1000);// decoded.exp est en secondes, on le convertit en millisecondes pour l'objet Date


            await prisma.blacklistedAccessToken.create({

                data: {
                    token: accessToken,
                    expiresAt: expiryDate
                }

            });
        }
    }

    // 7. Mot de passe oublié
    static async forgotPassword(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return;

        const token = crypto.randomBytes(512).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1h

        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt
            }
        });

        const url = `http://localhost:3000/reset_password?token=${token}`;
        await EmailService.sendEmail(
            email,
            "Réinitialisation de mot de passe",
            `Cliquez ici : <a href="${url}">${url}</a>`
        );
    }

    static async resetPassword(token, newPassword) {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new UnauthorizedException("Token invalide ou expiré");
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword }
            }),
            prisma.passwordResetToken.delete({
                where: { token }
            })
        ]);
    }

    // 8. Changement de mot de passe (Profil)
    static async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException("Utilisateur non trouvé");

        const isValid = await verifyPassword(user.password, oldPassword);
        if (!isValid) throw new UnauthorizedException("L'ancien mot de passe est incorrect");

        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
    }

    // 9. Historique
    static async saveLoginHistory(userId, data) {
        return prisma.loginHistory.create({
            data: {
                userId,
                ip: data.ip,
                userAgent: data.userAgent,
            },
        });
    }
}