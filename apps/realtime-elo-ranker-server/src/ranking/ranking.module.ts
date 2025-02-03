import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { Player } from 'src/player/entities/player.entity';

@Module({
  controllers: [RankingController],
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [RankingService],
})
export class RankingModule {}