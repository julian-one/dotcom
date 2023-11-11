import { Pool } from 'pg';
import { UserRecord } from './types';
import env from '../env';

class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      user: env.DB_USER,
      host: env.DB_HOST,
      database: env.DB_NAME,
      password: env.DB_PASSWORD,
      port: env.DB_PORT,
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async getUserByUsername(username: string): Promise<UserRecord> {
    const result = await this.query(
      'SELECT * FROM users WHERE username = $1 LIMIT 1',
      [username],
    );
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  }

  public async getUserById(id: number): Promise<UserRecord> {
    const result = await this.query(
      'SELECT * FROM users WHERE user_id = $1 LIMIT 1',
      [id],
    );
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  }

  public async getUsers(): Promise<UserRecord[]> {
    const result = await this.query('SELECT * FROM users');
    return result.rows;
  }

  public async checkUserExistsByUsername(username: string): Promise<boolean> {
    const result = await this.query(
      'SELECT * FROM users WHERE username = $1 LIMIT 1',
      [username],
    );
    return result.rows.length > 0;
  }

  public async checkUserExistsByEmail(email: string): Promise<boolean> {
    const result = await this.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email],
    );
    return result.rows.length > 0;
  }

  public async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<UserRecord> {
    const result = await this.query(
      'INSERT INTO users (username, email, password, created_on) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [username, email, password],
    );
    if (result.rows.length === 0) {
      throw new Error('User creation failed');
    }
    return result.rows[0];
  }

  public async updateUserLastLogin(id: number): Promise<void> {
    await this.query(
      'UPDATE users set last_login = now() where user_id = $1',
      [id],
    );
  }

}

export default Database;
