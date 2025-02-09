import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';

describe('EventsService', () => {
    let service: EventsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EventsService],
        }).compile();

        service = module.get<EventsService>(EventsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('emitRankingUpdate', () => {
        it('should emit ranking update event', () => {
            const player = { id: '1', rank: 1000 };
            const emitSpy = jest.spyOn(service['rankingEmitter'], 'emit');

            service.emitRankingUpdate(player);

            expect(emitSpy).toHaveBeenCalledWith('rankingUpdate', player);
        });
    });

    describe('getRankingEmitter', () => {
        it('should return ranking emitter instance', () => {
            const emitter = service.getRankingEmitter();
            expect(emitter).toBe(service['rankingEmitter']);
        });
    });
});