import { Repository } from 'typeorm';
import { Match } from '../entities/match.entity';
import { PlayerService } from '../../player/services/player.service';
import { CreateMatchDto } from '../dto/create-match.dto';
export declare class MatchService {
    private matchRepository;
    private playerService;
    constructor(matchRepository: Repository<Match>, playerService: PlayerService);
    handlePlayerError(error: any, callback: (error: any, result?: any) => void, role: string): void;
    calculateElo(winnerRank: number, loserRank: number, draw: boolean): {
        newWinnerRank: number;
        newLoserRank: number;
    };
    create(createMatchDto: CreateMatchDto, callback: (error: any, result?: any) => void): void;
    findOne(id: string, callback: (error: any, result?: any) => void): void;
}
