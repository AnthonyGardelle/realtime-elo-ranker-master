import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './services/match.service';
import { MatchController } from './controllers/match.controller';
import { Match } from './entities/match.entity';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';

@Module({
  controllers: [MatchController],
  imports: [
    TypeOrmModule.forFeature([Match, Player]), 
    PlayerModule,
  ],
  providers: [MatchService],
})
export class MatchModule { }