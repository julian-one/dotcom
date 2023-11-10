import { Request, Response } from 'express';
import {
  SessionInitializationError,
  SessionDestructionError,
} from '../error/types';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import env from '../env';
import Database from '../database';

const PgSession = connectPgSimple(session);

class Session {
  static configure(db: Database) {
    console.log(
      ' -------------- Session.config 000 -------------',
      env.SESSION_SECRET,
      env.IS_COOKIE_SECURE
    )
    const myPool = db.getPool();
    console.log(
      ' -------------- Session.config 001 -------------',
      myPool,
      JSON.stringify(myPool)
    )
    return session({
      store: new PgSession({
        pool: myPool,
        tableName: 'sessions',
      }),
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: env.IS_COOKIE_SECURE,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
      },
    });
  }

  static initialize(req: Request, userId: number): Promise<void> {
    console.log(
      ' -------------- Session.initialize -------------',
    )

    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session initialization failed:', err);
          reject(new SessionInitializationError('Error regenerating session'));
        } else {
          req.session.userId = userId;
          console.log(`Session initialized for user ${userId}`);
          resolve();
        }
      });
    });
  }

  static destroy(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction failed:', err);
          reject(new SessionDestructionError('Error destroying session'));
        } else {
          console.log(
            `Session destroyed for session ${JSON.stringify(req.session)}`,
          );
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
