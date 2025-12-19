// src/shared/database/database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private isConnected = false;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'feedback_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '123',
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Обработка ошибок пула
    this.pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
      this.isConnected = false;
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  private async connect() {
    try {
      await this.pool.query('SELECT NOW()');
      this.isConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }

    try {
      const result = await this.pool.query<T>(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', {
        query: text,
        params,
        error: error.message,
      });
      throw error;
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database transaction error:', {
        error: error.message,
      });
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }


  // Вспомогательные методы
  async findOne<T = any>(query: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T>(query, params);
    return result.rows[0] || null;
  }

  async findMany<T = any>(query: string, params?: any[]): Promise<T[]> {
    const result = await this.query<T>(query, params);
    return result.rows;
  }

  async insert(table: string, data: Record<string, any>, returning = 'id') {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      RETURNING ${returning}
    `;
    
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async update(table: string, id: number | string, data: Record<string, any>, idColumn = 'id') {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${idColumn} = $${keys.length + 1}
      RETURNING *
    `;
    
    const result = await this.query(query, [...values, id]);
    return result.rows[0];
  }
}