import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { MatchService } from '../services/match.service';
import { CreateMatchDto } from '../dto/create-match.dto';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) { }

  @Post()
  @HttpCode(200)
  create(@Body() createMatchDto: CreateMatchDto) {
    return new Promise((resolve, reject) => {
      this.matchService.create(createMatchDto, (error, result) => {
        if (error) {
          let errorResponse;

          if (error instanceof UnprocessableEntityException) {
            errorResponse = {
              code: 422,
              message: error.message
            };
            reject(new UnprocessableEntityException(errorResponse));
          } else if (error instanceof BadRequestException) {
            errorResponse = {
              code: 400,
              message: error.message
            };
            reject(new BadRequestException(errorResponse));
          } else {
            reject(error);
          }
        } else {
          resolve({ "winner": { "id": result.winnerId, "rank": result.winnerRank }, "loser": { "id": result.loserId, "rank": result.loserRank } });
        }
      });
    });
  }
}
