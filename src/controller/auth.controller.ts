import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserInput, LoginInput } from '../domain/user';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async signup(req: Request, res: Response) {
    try {
      const userData: UserInput = req.body;
      const result = await this.authService.signup(userData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async signin(req: Request, res: Response) {
    try {
      const loginData: LoginInput = req.body;
      const result = await this.authService.signin(loginData);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
} 