import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { MatchService } from '../services/match.service';
import { CreateMatchDto } from '../dto/create-match.dto';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) { }

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return new Promise((resolve, reject) => {
      this.matchService.create(createMatchDto, (error, result) => {
        if (error) {
          if (error instanceof UnprocessableEntityException) {
            resolve({ "code": 422, "message": error.message });
          } else if (error instanceof BadRequestException) {
            resolve({ "code": 400, "message": error.message });
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
