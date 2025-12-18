// src/auth/user.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';

export interface User {
  id: string;
  login: string;
  password: string;
  role: 'USER' | 'ADMIN';
  telegram_chat_id?: string;
}

@Injectable()
export class UserRepository extends BaseRepository {
  constructor(db: DatabaseService) {
    super(db);
  }

  async findByLogin(login: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE login = $1 
      LIMIT 1
    `;
    return this.executeQueryOne<User>(query, [login]);
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT * FROM users 
      WHERE id = $1 
      LIMIT 1
    `;
    return this.executeQueryOne<User>(query, [id]);
  }

  async create(login: string, password: string): Promise<User> {
    
    const query = `
      INSERT INTO users (login, password)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await this.db.query<User>(query, [login, password]);
    return result.rows[0];
  }

  async updateTelegramChatId(userId: string, chatId: string): Promise<void> {
    const query = `
      UPDATE users 
      SET telegram_chat_id = $1 
      WHERE id = $2
    `;
    await this.db.query(query, [chatId, userId]);
  }

  async findUserWithTelegram(login: string, password: string): Promise<User | null> {
    const user = await this.findByLogin(login);
    if (!user) return null;

    return password == user.password ? user : null;
  }
}