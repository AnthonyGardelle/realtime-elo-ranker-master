import { Controller, Post, Body, BadRequestException, ConflictException, HttpCode, HttpException } from '@nestjs/common';
import { PlayerService } from '../services/player.service';
import { CreatePlayerDto } from '../dto/create-player.dto';

@Controller('api/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) { }

  @Post()
  @HttpCode(200)
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return new Promise((resolve, reject) => {
      this.playerService.create(createPlayerDto, (error, result) => {
        if (error) {
          let errorResponse;
          
          if (error instanceof BadRequestException) {
            errorResponse = {
              code: 400,
              message: error.message
            };
            reject(new BadRequestException(errorResponse));
          } else if (error instanceof ConflictException) {
            errorResponse = {
              code: 409,
              message: error.message
            };
            reject(new ConflictException(errorResponse));
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