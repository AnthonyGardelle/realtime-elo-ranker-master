import { Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { EventsService } from '../../events/services/events.service';
export declare class PlayerService {
    private playerRepository;
    private eventsService;
    constructor(playerRepository: Repository<Player>, eventsService: EventsService);
    findAll(callback: (error: any, result?: Player[]) => void): void;
    create(createPlayerDto: CreatePlayerDto, callback: (error: any, result?: any) => void): void;
    findOne(id: string, callback: (error: any, result?: any) => void): void;
    update(player: Player, callback: (error: any) => void): void;
}
