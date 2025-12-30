import { UserService } from "#services/user.service";
import { UserDto } from "#dto/user.dto";
//import { signToken } from "#lib/jwt";
import { validateData } from "#lib/validate";
import { registerSchema, loginSchema } from "#schemas/user.schema";
import { config } from "#config/env";
import { ForbiddenException, UnauthorizedException } from "#lib/exceptions";


export class UserController {
  static async register(req, res) {
    const validatedData = validateData(registerSchema, req.body);
    const user = await UserService.register(validatedData);
<<<<<<< HEAD
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

<<<<<<< HEAD
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

  // github authentication
  static async githubAuth(_req, res) {
    const githubClientId = config.GITHUB_CLIENT_ID;
    const githubRedirectURL = 'http://localhost:3000/auth/githubCallback';
    const state = config.GITHUB_STATE;
    const url = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectURL}&scope=user&state=${state}`;
    res.redirect(url);
  }

  static async githubCallback(req, res) {
    const { code, state } = req.query;
    if (state !== config.GITHUB_STATE) {
      console.error(`State Mismatch. Received: ${state}, Expected: ${config.GITHUB_STATE}`);
      throw new UnauthorizedException("state doesn't match possible cssrf");
    }
    const githubClientId = config.GITHUB_CLIENT_ID;
    const githubClientSecret = config.GITHUB_CLIENT_SECRET;
    const githubRedirectURL = 'http://localhost:3000/auth/githubCallback';

    let response = await fetch('https://github.com/login/oauth/access_token', {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code: code,
        redirect_uri: githubRedirectURL
      })
    })

    if (!response.ok) {
      throw new ForbiddenException("unprocessable access_token ");
    }
=======
=======
    const token = await signToken({ userId: user.id });

    res.status(201).json({
      success: true,
      user: UserDto.transform(user),
      token,
    });
  }

<<<<<<< HEAD
>>>>>>> 6764f0f (correction1)
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

<<<<<<< HEAD
>>>>>>> fe0e3ad (Gestion des sessions et LoginHistory)

    let data = await response.json();

    const access_token = data.access_token;

    response = await fetch('https://api.github.com/user', {
      method: "GET",
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'User-Agent': 'NodeJS-App'
      }
    })

    if (!response.ok) {
      throw new ForbiddenException("impossible to get user data");
    }
    const userData = await response.json();
    let user = await UserService.findByEmail(userData.email);
    console.log(user);
    
    if (user) {
      const result = await UserService.loginGithubUser(user);

      return res.json({
        success: true,
        message: "Connexion réussie",
        data: {
          user: UserDto.transform(result.user),
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      })
    } else {
      const user = await UserService.registerGithubUser(userData);

      return res.status(201).json({
        success: true,
        message: "Utilisateur créé avec succès",
        user: UserDto.transform(user),
      });
    }

  }

  static async authenticateGithubUser() {

  }
=======
=======
  static async login(req, res) {
    const validatedData = validateData(loginSchema, req.body);
    const { email, password } = validatedData;

    const user = await UserService.login(email, password);
    const token = await signToken({ userId: user.id });

    res.json({
      success: true,
      user: UserDto.transform(user),
      token,
    });
  }
>>>>>>> 871047c (correction1)
>>>>>>> 6764f0f (correction1)

  // github authentication
  static async githubAuth(_req, res) {
    const githubClientId = config.GITHUB_CLIENT_ID;
    const githubRedirectURL = 'http://localhost:3000/auth/githubCallback';
    const state = config.GITHUB_STATE;
    const url = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${githubRedirectURL}&scope=user&state=${state}`;
    res.redirect(url);
  }
  static async githubCallback(req, res) {
    const { code, state } = req.query;
    if (state !== config.GITHUB_STATE) {
      console.error(`State Mismatch. Received: ${state}, Expected: ${config.GITHUB_STATE}`);
      throw new UnauthorizedException("state doesn't match possible cssrf");
    }
    const githubClientId = config.GITHUB_CLIENT_ID;
    const githubClientSecret = config.GITHUB_CLIENT_SECRET;
    const githubRedirectURL = 'http://localhost:3000/auth/githubCallback';

    let response = await fetch('https://github.com/login/oauth/access_token', {
      method : "POST",
      headers : {
        'content-type' : 'application/json',
        'accept' : 'application/json'
      },
      body:JSON.stringify({
        client_id : githubClientId,
        client_secret : githubClientSecret,
        code : code,
        redirect_uri : githubRedirectURL
      })
    })

    if (!response.ok) {
      throw new ForbiddenException("unprocessable access_token ");
    }
    
    let data = await response.json() ;
    if (data.error) {
      console.error("GitHub Token Error:", data.error_description || data.error);
    }
    const access_token = data.access_token;

    response = await fetch('https://api.github.com/user', {
      method : "GET",
      headers :{
        'content-type' : 'application/json',
        'accept' : 'application/json',
        'Authorization' : `Bearer ${access_token}`,
        'User-Agent': 'NodeJS-App'
      }
    })

    if (!response.ok) {
      throw new ForbiddenException("impossible to get user data");
    }
    const userData = await response.json();
    console.log(userData);
    
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
<<<<<<< HEAD
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

  static async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;

    await UserService.changePassword(req.user.id, oldPassword, newPassword);

    res.json({ success: true, message: "Mot de passe mis à jour" });
  }
}
=======
}
>>>>>>> 6764f0f (correction1)
