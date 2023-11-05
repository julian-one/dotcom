import { Request, Response } from 'express';
import {
  SessionInitializationError,
  SessionDestructionError,
} from '../error/types';

class Session {
  static initialize(req: Request, userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(new SessionInitializationError('Error regenerating session'));
        } else {
          req.session.userId = userId;
          resolve();
        }
      });
    });
  }

  static destroy(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new SessionDestructionError('Error destroying session'));
        } else {
          resolve();
        }
      });
    });
  }

  private static isActive(req: Request): boolean {
    const expiration = req.session.cookie.expires;
    if (expiration) {
      return new Date(expiration) > new Date();
    }
    return true;
  }

  static async isValid(req: Request, res: Response): Promise<void> {
    const userId: number | undefined = req.session.userId;
    const isLoggedIn = userId !== undefined && this.isActive(req);

    res.json({ isLoggedIn });
  }
}

export default Session;
