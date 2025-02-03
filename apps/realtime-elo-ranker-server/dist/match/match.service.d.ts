import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PlayerService } from 'src/player/player.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { Player } from 'src/player/entities/player.entity';
export declare class MatchService {
    private matchRepository;
    private playerService;
    private playerRepository;
    constructor(matchRepository: Repository<Match>, playerService: PlayerService, playerRepository: Repository<Player>);
    handlePlayerError(error: any, callback: (error: any, result?: any) => void, role: string): void;
    calculateElo(winnerRank: number, loserRank: number, draw: boolean): {
        newWinnerRank: number;
        newLoserRank: number;
    };
    findAll(callback: (error: any, result?: any) => void): void;
    create(createMatchDto: CreateMatchDto, callback: (error: any, result?: any) => void): void;
    findOne(id: string, callback: (error: any, result?: any) => void): void;
    update(id: string, updateMatchDto: UpdateMatchDto, callback: (error: any, result?: any) => void): void;
    delete(id: number): void;
}
