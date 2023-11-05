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
          //   if (req.session.cookie) {
          //     res.clearCookie('connect.sid');
          //   }
          resolve();
        }
      });
    });
  }
}

export default Session;
