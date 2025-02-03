import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player } from './entities/player.entity';

@Module({
  controllers: [PlayerController],
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule { }
