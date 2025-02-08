import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RankingService } from './services/ranking.service';
import { RankingController } from './controllers/ranking.controller';
import { Player } from '../player/entities/player.entity';
import { PlayerModule } from '../player/player.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    EventEmitterModule.forRoot(),
    PlayerModule,
    EventsModule
  ],
  controllers: [RankingController],
  providers: [RankingService],
  exports: [RankingService]
})
export class RankingModule {}