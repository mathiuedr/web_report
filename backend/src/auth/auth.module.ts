// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [AuthController],
  providers: [UserService,UserRepository,DatabaseService]
})
export class AuthModule {}