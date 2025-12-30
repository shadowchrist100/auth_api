import { UserService } from "#services/user.service";
import { UserDto } from "#dto/user.dto";
import { signToken } from "#lib/jwt";
import { validateData } from "#lib/validate";
import { registerSchema, loginSchema } from "#schemas/user.schema";
import { config } from "#config/env";
import { ForbiddenException, UnauthorizedException } from "#lib/exceptions";


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

    const user = await UserService.login(email, password);
    const token = await signToken({ userId: user.id });

    res.json({
      success: true,
      user: UserDto.transform(user),
      token,
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
}
