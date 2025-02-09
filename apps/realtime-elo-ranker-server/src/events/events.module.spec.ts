import { Test, TestingModule } from '@nestjs/testing';
import { EventsModule } from './events.module';
import { EventsService } from './services/events.service';

describe('EventsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EventsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide EventsService', () => {
    const service = module.get<EventsService>(EventsService);
    expect(service).toBeInstanceOf(EventsService);
  });
});