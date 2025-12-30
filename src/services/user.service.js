import prisma from "#lib/prisma";
import { generateAccessToken, createRefreshToken } from "#lib/jwt";
import { hashPassword, verifyPassword } from "#lib/password";
import { ConflictException, UnauthorizedException, NotFoundException } from "#lib/exceptions";
import { UserDto } from "#dto/user.dto";
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
}
