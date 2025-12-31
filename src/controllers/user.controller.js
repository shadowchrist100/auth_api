import { UserService } from "#services/user.service";
import { UserDto } from "#dto/user.dto";
//import { signToken } from "#lib/jwt";
import { validateData } from "#lib/validate";
import { registerSchema, loginSchema } from "#schemas/user.schema";

export class UserController {
  static async register(req, res) {
    const validatedData = validateData(registerSchema, req.body);
    const user = await UserService.register(validatedData);
    //const token = await signToken({ userId: user.id });

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: UserDto.transform(user),
      //token,
    });
  }

  static async login(req, res) {
    const validatedData = validateData(loginSchema, req.body);
    const { email, password } = validatedData;

    const result = await UserService.login(email, password);
    //const token = await signToken({ userId: user.id });

    res.json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: UserDto.transform(result.user),
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      }
    });
  }

  static async refresh(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: "Refresh token requis" });
    }

    const result = await UserService.refresh(refreshToken);
    res.json({
      success: true,
      accessToken: result.accessToken
    });
  }

  static async logout(req, res) {
    const { refreshToken } = req.body;
    // On récupère le token Bearer dans le header Authorization
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];

    await UserService.logout(refreshToken, accessToken);

    res.json({
      success: true,
      message: "Déconnexion réussie"
    });
  }

  static async getAll(req, res) {
    const users = await UserService.findAll();
    res.json({
      success: true,
      users: UserDto.transform(users),
    });
  }

  static async getById(req, res) {
    const user = await UserService.findById(parseInt(req.params.id));
    res.json({
      success: true,
      user: UserDto.transform(user),
    });
  }
  static async forgotPassword(req, res) {
    const { email } = req.body;
    await UserService.forgotPassword(email);

    if (!email) {
      return res.status(400).json({ success: false, error: "Email requis" });
    }

    await UserService.forgotPassword(email);
    res.json({
      success: true,
      message: "Si cet email existe, un lien de récupération a été envoyé."
    });
  }

  static async resetPassword(req, res) {
    const { token, password } = req.body;
    if (!token || !password) {
      throw new BadRequestException("Token et mot de passe requis");
    }

    await UserService.resetPassword(token, password);
    res.json({ success: true, message: "Mot de passe modifié avec succès." });
  }
}