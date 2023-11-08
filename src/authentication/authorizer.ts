import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../error/types';
import Database from '../database';
import env from '../env';
import { toUser } from '../users/types';

const authorizer = async (
  { session }: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = session;
  if (!userId) {
    return next(new UnauthorizedError('You are not authenticated'));
  }

  try {
    const db = Database.getInstance();
    const record = await db.getUserById(userId);
    const user = toUser(record);
    const allowedEmails = env.ALLOWED_EMAILS.split(',');

    if (!allowedEmails.includes(user.email)) {
      return next(
        new ForbiddenError('You are not authorized to access this resource'),
      );
    }

    next();
  } catch (error) {
    next(new UnauthorizedError('Failed to authorize user'));
  }
};

export default authorizer;
