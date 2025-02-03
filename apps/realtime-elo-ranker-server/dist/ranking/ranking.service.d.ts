import { Repository } from 'typeorm';
import { Player } from '../player/entities/player.entity';
export declare class RankingService {
    private playerRepository;
    constructor(playerRepository: Repository<Player>);
    getRanking(callback: (error: any, ranking?: {
        id: string;
        rank: number;
    }[]) => void): void;
}
