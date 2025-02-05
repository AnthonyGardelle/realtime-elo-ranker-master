import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { Player } from 'src/player/entities/player.entity';

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