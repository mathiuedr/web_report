// src/feedback/feedback.service.ts
import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';

@Injectable()
export class FeedbackService {
    constructor(
        private feedbackRepo: FeedbackRepository,
    ) { }

    async createRequest(requestText: string, userId: string) {
        const feedback = await this.feedbackRepo.create(requestText, userId);

        return {
            request_id: feedback.id,
        };
    }

    async answerToRequest(data: {
        request_id: number;
        response_text: string;
        user_id: string; // admin id
    }) {
        const res = await this.feedbackRepo.checkUserIsAdmin(data.user_id)
        if(res){
            const answer = await this.feedbackRepo.addAnswer(
                data.request_id,
                data.response_text,
                data.user_id,
            );
            return answer
        }else{
            return null
        }
        
    }

    async getCurrentRequests(adminId: string) {
        if(!await this.feedbackRepo.checkUserIsAdmin(adminId)) return null
        const requests = await this.feedbackRepo.getCurrentRequests();

        return requests.map(r => ({
            request_id: r.id,
            text: r.text,
            user_id: r.user_id,
        }));
    }
    async updateRequest(request_id: number, request_text: string, user_id: string) {
        if(await this.feedbackRepo.checkPending(request_id)){
            await this.feedbackRepo.updateText(request_id, request_text)
            return true
        }
        return false
    }
    
    async getAnswers(user_id: string){
        
        const res = await this.feedbackRepo.getUserAnswers(user_id)
        return res.map(r => ({
            request_id: r.id,
            text: r.text,
            answer: r.answer
        }));
    }
    
    async deleteRequest(request_id: number, user_id: string){
        try{
            await this.feedbackRepo.delete(request_id)
            return true
        }catch(err){
            return false
        }
    }
    async getArchive(user_id:string){
        if(!await this.feedbackRepo.checkUserIsAdmin(user_id)) return null
        return await this.feedbackRepo.getArchive()
    }
    async getUserRequests(user_id:string){
        const res = await this.feedbackRepo.findUserFeedbacks(user_id)
        return res.map(r => ({
            request_id: r.id,
            text: r.text,
            status: r.status
        }));
    }
}