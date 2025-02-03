import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller('api/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) { }

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

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return new Promise((resolve, reject) => {
      this.playerService.create(createPlayerDto, (error, result) => {
        if (error) {
          if (error instanceof BadRequestException) {
            resolve({ "code": 400, "message": error.message });
          } else if (error instanceof ConflictException) {
            resolve({ "code": 409, "message": error.message });
          } else {
            reject(error);
          }
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
            resolve({ "code": 400, "message": error.message });
          }
          else if (error instanceof UnprocessableEntityException) {
            resolve({ "code": 422, "message": error.message });
          } else {
            reject(error);
          }
        } else {
          resolve(result);
        }
      });
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return new Promise((resolve, reject) => {
      this.playerService.update(id, updatePlayerDto, (error, result) => {
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
      });
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return new Promise((resolve, reject) => {
      this.playerService.delete(id, (error, result) => {
        if (error) {
          if (error instanceof BadRequestException) {
            resolve({ "code": 400, "message": error.message });
          } else if (error instanceof UnprocessableEntityException) {
            resolve({ "code": 422, "message": error.message });
          } else {
            reject(error);
          }
        } else {
          resolve({ "code": 204, "message": "Joueur supprimé" });
        }
      });
    });
  }
}