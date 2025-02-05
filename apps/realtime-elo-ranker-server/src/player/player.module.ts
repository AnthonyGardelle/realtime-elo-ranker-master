import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player } from './entities/player.entity';
import { RankingModule } from '../ranking/ranking.module';

@Module({
  controllers: [PlayerController],
  imports: [
    TypeOrmModule.forFeature([Player]),
    RankingModule
  ],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}