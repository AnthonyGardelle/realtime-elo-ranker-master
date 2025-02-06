import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RankingService } from './services/ranking.service';
import { RankingController } from './controllers/ranking.controller';
import { Player } from '../player/entities/player.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    EventEmitterModule.forRoot()
  ],
  controllers: [RankingController],
  providers: [RankingService],
  exports: [RankingService]
})
export class RankingModule {}