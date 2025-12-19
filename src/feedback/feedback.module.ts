// src/feedback/feedback.module.ts
import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackRepository } from './feedback.repository';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, DatabaseService]
})
export class FeedbackModule {}