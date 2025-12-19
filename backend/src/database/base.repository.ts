// src/shared/database/base.repository.ts
import { DatabaseService } from './database.service';

export abstract class BaseRepository {
  constructor(protected readonly db: DatabaseService) {}

  protected async executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
    const result = await this.db.query<T>(query, params);
    return result.rows;
  }

  protected async executeQueryOne<T = any>(query: string, params?: any[]): Promise<T | null> {
    const result = await this.db.query<T>(query, params);
    return result.rows[0] || null;
  }

  public async checkUserIsAdmin(user_id:string){
    const result = await this.db.query("SELECT role FROM users WHERE id = $1",[user_id])
    console.log(result)
    return result.rows[0]['role'] == 'ADMIN'
  }
}