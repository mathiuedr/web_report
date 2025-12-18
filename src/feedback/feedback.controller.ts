// src/feedback/feedback.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) { }


  @Post('createRequest')
  @HttpCode(HttpStatus.OK)
  async createRequest(@Body() body: any) {
    console.log('Creating feedback:', body);

    return this.feedbackService.createRequest(body.request_text, body.user_id);

  }

  @Put('updateRequest')
  @HttpCode(HttpStatus.OK)
  async updateRequest(@Body() body: any) {
    console.log(' Updating feedback:', body);
    const res = await this.feedbackService.updateRequest(body.request_id, body.request_text, body.user_id)
    console.log(res)
    if (res) {
      return { message: "Successfully updated" }
    } else {
      throw new HttpException(
        { message: 'Update failed' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }




  }

  @Get('getAnswers')
  @HttpCode(HttpStatus.OK)
  async getAnswers(@Query('user_id') userId: string) {
    console.log('Getting answers for user:', userId);

    return await this.feedbackService.getAnswers(userId)
  }

  // ============ АДМИНСКИЕ ЭНДПОИНТЫ ============

  @Post('answerToRequest')
  @HttpCode(HttpStatus.OK)
  async answerToRequest(@Body() body: any) {
    console.log('Admin answering to feedback:', body);
    const res = await this.feedbackService.answerToRequest({
      request_id: body.request_id,
      response_text: body.response_text,
      user_id: body.user_id
    })
    if(res) return res
    throw new HttpException(
        { message: 'Answer failed' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
  }

  @Delete('deleteRequest')
  @HttpCode(HttpStatus.OK)
  async deleteRequest(@Body() body: any) {
    
    console.log('Deleting feedback:', body);
    const res = await this.feedbackService.deleteRequest(body.request_id, body.user_id)
    if (res) {
      return {
        message: 'Feedback deleted successfully'
      };
    }else{
        throw new HttpException(
        { message: 'Delete failed' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

  }

  @Get('getCurrentRequests')
  @HttpCode(HttpStatus.OK)
  async getCurrentRequests(@Query('user_id') adminId: string) {
    console.log('Getting current requests for admin:', adminId);

    return this.feedbackService.getCurrentRequests(adminId);

  }

  @Get('getArchive')
  @HttpCode(HttpStatus.OK)
  async getArchive(@Query('user_id') adminId: string) {
    console.log('Getting archive for admin:', adminId);
    const res = await this.feedbackService.getArchive(adminId)
    if(res) return res
    throw new HttpException(
        { message: 'Not enough permissions to get archive' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );

  }
}