import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { RankingService } from '../ranking/ranking.service';
export declare class PlayerService {
    private playerRepository;
    private rankingService;
    constructor(playerRepository: Repository<Player>, rankingService: RankingService);
    findAll(callback: (error: any, result?: any) => void): void;
    create(createPlayerDto: CreatePlayerDto, callback: (error: any, result?: any) => void): void;
    findOne(id: string, callback: (error: any, result?: any) => void): void;
}
