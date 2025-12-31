import prisma from "#lib/prisma";
import { generateAccessToken, createRefreshToken, verifyRefreshToken } from "#lib/jwt";
import { hashPassword, verifyPassword } from "#lib/password";
import { ConflictException, UnauthorizedException, NotFoundException } from "#lib/exceptions";
import { UserDto } from "#dto/user.dto";
import crypto from 'node:crypto';

export class UserService {
  static async register(data) {
    const { email, password, firstName, lastName } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException("Email déjà utilisé");
    }

    const hashedPassword = await hashPassword(password);

    //REVIENT PROBLEME ICI
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      },
    });
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

  static async findAll() {
    return prisma.user.findMany();
  }

  static async findById(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("Utilisateur non trouvé");
    }

    return user;
  }


  static async refresh(token) {
    const storedToken = await verifyRefreshToken(token);
    if (!storedToken) {
      throw new UnauthorizedException("Refresh Token invalide ou expiré");
    }

    // Générer un nouvel Access Token
    const accessToken = await generateAccessToken({
      id: storedToken.user.id,
      email: storedToken.user.email
    });

    return { accessToken };
  }

  static async logout(refreshToken, accessToken) {

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() }
    });


    if (accessToken) {
      await prisma.BlacklistedAccessToken.create({
        data: {
          token: accessToken,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        }
      });
    }
  }


  static async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) return;

    // Générer un token unique
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    await prisma.PasswordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    //Simuler l'envoi d'email
    console.log(`--- SIMULATION EMAIL ---`);
    console.log(`À: ${email}`);
    console.log(`Lien de réinitialisation: http://localhost:3000/reset_password?token=${token}`);
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

  static async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException("Utilisateur non trouvé");

    const isValid = await verifyPassword(user.password, oldPassword);
    if (!isValid) {
      throw new UnauthorizedException("L'ancien mot de passe est incorrect");
    }

    
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }
}