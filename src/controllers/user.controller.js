import { UserService } from "#services/user.service";
import { UserDto } from "#dto/user.dto";
import { signToken } from "#lib/jwt";
import { validateData } from "#lib/validate";
import { registerSchema, loginSchema } from "#schemas/user.schema";

export class UserController {
    static async register(req, res) {
        const validatedData = validateData(registerSchema, req.body);
        const user = await UserService.register(validatedData);
        const token = await signToken({ userId: user.id });

        res.status(201).json({
            success: true,
            user: UserDto.transform(user),
            token,
        });
    }

    static async login(req, res) {
    const validatedData = validateData(loginSchema, req.body);
    const { email, password } = validatedData;

    // 1 Authentification
    const user = await UserService.login(email, password);

    // 2 Création de la session
    req.session.userId = user.id;

    // 3 Sauvegarde de l’historique de connexion
    await UserService.saveLoginHistory(user.id, {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });

    // 4 Génération du token JWT
    const token = await signToken({ userId: user.id });

    // 5 Réponse au client
    res.json({
        success: true,
        user: UserDto.transform(user),
        token,
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
}
