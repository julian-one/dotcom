
import Database from '../database';
import { asyncHandler } from '../handler';
import { User, toUser } from './types';

const database: Database = Database.getInstance();

export const getUsers = asyncHandler(async (req, res) => {
    const records = await database.getUsers();
    const users: User[] = [];
    for (const row of records) {
      users.push(toUser(row));
    }
    res.status(200).json(users )
});

export const getSessions = asyncHandler(async (req, res) => {
    res.status(200).json([])
});

