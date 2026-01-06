import prisma from "#lib/prisma";
import { generateAccessToken, createRefreshToken, verifyRefreshToken } from "#lib/jwt";
import { hashPassword, verifyPassword } from "#lib/password";
import { ConflictException, UnauthorizedException, NotFoundException } from "#lib/exceptions";
import { UserDto } from "#dto/user.dto";
import crypto from 'node:crypto';
import { EmailService } from "#services/email.service";

export class UserService {
    static async verifyEmail(email, code) {
        const user = await this.findByEmail(email)

        if (!user || user.verificationCode != code) {
            console.error("code: ", code, "verifCode: ", user.verificationCode);
            
            throw new UnauthorizedException("Utilisateur non authentifié ou code invalide")
        }

        return await prisma.user.update({
            where : { email},
            data: {
                emailVerifiedAt: new Date(),
                verificationCode: null
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

        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        // envoyer un mail pour vérifer le mail 
        const url = `http://localhost:3000/auth/emailVerification?code=${verificationCode}&email=${email}`;
        await EmailService.sendEmail(email, "Email Verification", `<a href=${url}>Cliquer sur ce lien pour vérifier votre email</a>`);
        // on cree l'utilisateur sans  vérifier l'email
        return await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                verificationCode
            },
        })
    }

    // Connexion
    static async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await verifyPassword(user.password, password))) {
            throw new UnauthorizedException("Identifiants invalides");
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
        const nameParts = name ? name.split(' ') : ['GitHub', 'User'];
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
    static async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await verifyPassword(user.password, password))) {
            throw new UnauthorizedException("Identifiants invalides");
        }
        //on génère l'Access Token (JWT)
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

        const accessToken = await generateAccessToken({
            id: storedToken.user.id,
            email: storedToken.user.email
        });

        return { accessToken };
    }

    static async logout(refreshToken, accessToken) {
        // Invalider le refresh token
        await prisma.refreshToken.updateMany({
            where: { token: refreshToken },
            data: { revokedAt: new Date() }
        });

        // Blacklister l'access token
        if (accessToken) {
            await prisma.blacklistedAccessToken.create({
                data: {
                    token: accessToken,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
                }
            });
        }
    }

    // 7. Mot de passe oublié
    static async forgotPassword(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return;

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1h

        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt
            }
        });

        console.log(`--- SIMULATION EMAIL ---`);
        console.log(`Lien: http://localhost:3000/reset_password?token=${token}`);
        console.log(`-------------------------`);
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