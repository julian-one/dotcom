import { Pool } from 'pg';
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

  public async query(text: string, params?: string[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async userExists(username: string, email: string): Promise<boolean> {
    const result = await this.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2 LIMIT 1',
      [username, email],
    );
    return result.rows.length > 0;
  }

  public async createUser(
    username: string,
    email: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.query(
      'INSERT INTO users (username, email, password, created_on) VALUES ($1, $2, $3, NOW())',
      [username, email, hashedPassword],
    );
  }
}

export default Database;
