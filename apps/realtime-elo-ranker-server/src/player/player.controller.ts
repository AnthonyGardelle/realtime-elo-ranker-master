import { Controller, Get, Post, Body, Param, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('api/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return new Promise((resolve, reject) => {
      this.playerService.create(createPlayerDto, (error, result) => {
        if (error) {
          if (error instanceof BadRequestException) {
            resolve({ code: 400, message: error.message });
          } else if (error instanceof ConflictException) {
            resolve({ code: 409, message: error.message });
          } else {
            reject(error);
          }
        } else {
          resolve(result);
        }
      });
    });
  }

  @Get()
  findAll() {
    return new Promise((resolve, reject) => {
      this.playerService.findAll((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return new Promise((resolve, reject) => {
      this.playerService.findOne(id, (error, result) => {
        if (error) {
          if (error instanceof BadRequestException) {
            resolve({ code: 400, message: error.message });
          } else if (error instanceof UnprocessableEntityException) {
            resolve({ code: 422, message: error.message });
          } else {
            reject(error);
          }
        } else {
          resolve(result);
        }
      });
    });
  }
}