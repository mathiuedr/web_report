// src/feedback/feedback.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../database/base.repository';
import { DatabaseService } from '../database/database.service';

export interface Feedback {
  id: number;
  text: string;
  status: 'PENDING' | 'ANSWERED';
  user_id: string;
}

export interface FeedbackWithUser extends Feedback {
  user_login: string;
  user_telegram_chat_id: string | null;
}

export interface FeedbackAnswer {
  id: string;
  text: string;

}

@Injectable()
export class FeedbackRepository extends BaseRepository {
  constructor(db: DatabaseService) {
    super(db);
  }

  async create(text: string, userId: string): Promise<Feedback> {
    const query = `
      INSERT INTO feedbacks (text, user_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await this.db.query<Feedback>(query, [text, userId]);
    return result.rows[0];
  }

  async findById(id: number): Promise<FeedbackWithUser | null> {
    const query = `
      SELECT f.*, u.login as user_login, u.telegram_chat_id as user_telegram_chat_id
      FROM feedbacks f
      JOIN users u ON f.user_id = u.id
      WHERE f.id = $1
    `;
    return this.executeQueryOne<FeedbackWithUser>(query, [id]);
  }

  async updateText(id: number, text: string): Promise<Feedback> {
    const query = `
      UPDATE feedbacks 
      SET text = $1 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await this.db.query<Feedback>(query, [text, id]);
    return result.rows[0];
  }

  async checkPending(id:number){

      const result = await this.findById(id)

      return result.status == 'PENDING'
  }

  async findUserFeedbacks(userId: string): Promise<Feedback[]> {
    const query = `
      SELECT * FROM feedbacks 
      WHERE user_id = $1
      ORDER BY id DESC
    `;
    return this.executeQuery<Feedback>(query, [userId]);
  }

  async getCurrentRequests(): Promise<FeedbackWithUser[]> {
    const query = `
      SELECT f.*, u.login as user_login
      FROM feedbacks f
      JOIN users u ON f.user_id = u.id
      WHERE f.status = 'PENDING'
    `;
    return this.executeQuery<FeedbackWithUser>(query);
  }
  

  async getArchive(): Promise<FeedbackWithUser[]> {
    const query = `
      SELECT f.*, u.login as user_login
      FROM feedbacks f
      JOIN users u ON f.user_id = u.id
      WHERE f.status = 'ANSWERED'
    `;
    return this.executeQuery<FeedbackWithUser>(query);
  }

  async delete(id: number): Promise<void> {
    const query = `DELETE FROM feedbacks WHERE id = $1`;
    await this.db.query(query, [id]);
  }

  async addAnswer(feedbackId: number, text: string, adminId: string): Promise<FeedbackAnswer> {
    return this.db.transaction(async (client) => {
      const answerQuery = `
        UPDATE feedbacks SET answer = $1, status = 'ANSWERED' WHERE id = $2
        RETURNING *
      `;
      const answerResult = await client.query<FeedbackAnswer>(
        answerQuery, 
        [text, feedbackId]
      );

      
      return answerResult.rows[0];
    });
  }


  async getUserAnswers(userId: string){
    const query = `
      SELECT 
        f.*
      FROM feedbacks f
      JOIN users u ON f.user_id = u.id
      WHERE f.user_id = $1 AND f.status = 'ANSWERED'
      ORDER BY f.id DESC
    `;
    
    const rows = await this.executeQuery<any>(query, [userId]);
    
    return rows;
  }
}