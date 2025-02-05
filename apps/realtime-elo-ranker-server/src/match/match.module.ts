import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from './entities/match.entity';
import { Player } from 'src/player/entities/player.entity';
import { PlayerModule } from 'src/player/player.module';
import { RankingModule } from 'src/ranking/ranking.module';

@Module({
  controllers: [MatchController],
  imports: [TypeOrmModule.forFeature([Match, Player]), PlayerModule, RankingModule],
  providers: [MatchService],
})
export class MatchModule { }
