// src/auth/user.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        private userRepo: UserRepository,
    ) { }

    async login (login: string, password: string) {
        
        const get_by_login = await this.userRepo.findByLogin(login)
        if(get_by_login){
            if(get_by_login.password == password) return {user_id:get_by_login.id}
            else return null
        }else{
            const created_user = await this.userRepo.create(login,password)
            return {user_id:created_user.id}
        }
    }

}