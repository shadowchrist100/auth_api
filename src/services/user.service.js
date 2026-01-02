import prisma from "#lib/prisma";
<<<<<<< HEAD
<<<<<<< HEAD
import { generateAccessToken, createRefreshToken, verifyRefreshToken } from "#lib/jwt";
import { hashPassword, verifyPassword } from "#lib/password";
import { ConflictException, UnauthorizedException, NotFoundException } from "#lib/exceptions";
import { UserDto } from "#dto/user.dto";
import crypto from 'node:crypto';

<<<<<<< HEAD
=======
import { generateAccessToken, createRefreshToken } from "#lib/jwt";
=======
import { generateAccessToken, createRefreshToken, verifyRefreshToken } from "#lib/jwt";
>>>>>>> 72d6a2d (Rafraîchissement de jeton et gestion de la déconnexion)
import { hashPassword, verifyPassword } from "#lib/password";
import { ConflictException, UnauthorizedException, NotFoundException } from "#lib/exceptions";
import { UserDto } from "#dto/user.dto";
>>>>>>> aa1ec1f (feat: implémentation de la connexion avec double token (Access et Refresh))
=======
>>>>>>> ffef489 (ajout du flux de réinitialisation de mot de passe oublié)
export class UserService {
<<<<<<< HEAD
<<<<<<< HEAD
    static async register(data) {
        const { email, password, firstName, lastName } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException("Email déjà utilisé");
        }

        const hashedPassword = await hashPassword(password);

        return prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName
            },
        });
=======
  static async register(data) {
    const { email, password, firstName, lastName } = data;
=======
    static async register(data) {
        const { email, password, firstName, lastName } = data;
>>>>>>> d162d7b (register github user)

<<<<<<< HEAD
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException("Email déjà utilisé");
>>>>>>> 6764f0f (correction1)
    }

    const hashedPassword = await hashPassword(password);

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      },
    });
  }

<<<<<<< HEAD
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
        }
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
=======
  static async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(user.password, password))) {
      throw new UnauthorizedException("Identifiants invalides");
>>>>>>> 6764f0f (correction1)
    }

<<<<<<< HEAD
<<<<<<< HEAD
    static async saveLoginHistory(userId, data) {
    return prisma.loginHistory.create({
        data: {
            userId,
            ip: data.ip,
            userAgent: data.userAgent,
        },
    });
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
<<<<<<< HEAD

    static async findByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return null;
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
            await prisma.blacklistedAccessToken.create({
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

        await prisma.passwordResetToken.create({
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
=======
    
=======
    return user;
=======
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
>>>>>>> 42695c6 (feat: implémentation de la connexion avec double token (Access et Refresh))
  }

  static async loginGithubUser(user){
    const accessToken = await generateAccessToken({
      id: user.id,
      email: user.email
    });

    const refreshToken = await createRefreshToken(user.id);

    return {
      user: new UserDto(user),
      accessToken,
      refreshToken 
    }
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
<<<<<<< HEAD
>>>>>>> 871047c (correction1)
}
<<<<<<< HEAD
>>>>>>> fe0e3ad (Gestion des sessions et LoginHistory)
=======
=======

  static async findByEmail(email) {
    const user =  await prisma.user.findUnique( { where: { email } } )

    if (!user) {
      return null;
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
=======
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException("Email déjà utilisé");
>>>>>>> c88580b (register github user)
        }

        const hashedPassword = await hashPassword(password);

        return prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName
            },
        });
    }
<<<<<<< HEAD
  }
<<<<<<< HEAD
}
>>>>>>> 3727738 (Rafraîchissement de jeton et gestion de la déconnexion)
<<<<<<< HEAD
>>>>>>> 72d6a2d (Rafraîchissement de jeton et gestion de la déconnexion)
=======
=======
=======

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
        }
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

    static async findByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return null;
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
>>>>>>> c88580b (register github user)


        if (accessToken) {
            await prisma.blacklistedAccessToken.create({
                data: {
                    token: accessToken,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
                }
            });
        }
    }


    static async forgotPassword(email) {
        const user = await prisma.user.findUnique({ where: { email: email } });

<<<<<<< HEAD
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
<<<<<<< HEAD
}
>>>>>>> 0fd706f (ajout du flux de réinitialisation de mot de passe oublié)
<<<<<<< HEAD
>>>>>>> ffef489 (ajout du flux de réinitialisation de mot de passe oublié)
=======
=======
=======
        if (!user) return;
>>>>>>> c88580b (register github user)

        // Générer un token unique
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000);

        await prisma.passwordResetToken.create({
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

<<<<<<< HEAD
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }
}
>>>>>>> b153923 (ajout du middleware auth et changement de mot de passe sécurisé)
<<<<<<< HEAD
>>>>>>> b9aac9d (ajout du middleware auth et changement de mot de passe sécurisé)
=======
=======
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
>>>>>>> c88580b (register github user)
>>>>>>> d162d7b (register github user)
