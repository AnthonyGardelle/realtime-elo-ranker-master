import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { MatchService } from '../services/match.service';
import { CreateMatchDto } from '../dto/create-match.dto';
import { UpdateMatchDto } from '../dto/update-match.dto';

@Controller('api/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) { }

  @Get()
  findAll() {
    return new Promise((resolve, reject) => {
      this.matchService.findAll((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return new Promise((resolve, reject) => {
      this.matchService.create(createMatchDto, (error, result) => {
        console.log(result);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return new Promise((resolve, reject) => {
      this.matchService.findOne(id, (error, result) => {
        if (error) {
          if (error instanceof BadRequestException) {
            resolve({ "code": 400, "message": error.message });
          } else if (error instanceof UnprocessableEntityException) {
            resolve({ "code": 422, "message": error.message });
          } else {
            reject(error);
          }
        } else {
          resolve(result);
        }
      }
      );
    }
    );
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    // TODO
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO
  }
}
