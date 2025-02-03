import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
export declare class PlayerService {
    private playerRepository;
    constructor(playerRepository: Repository<Player>);
    findAll(callback: (error: any, result?: any) => void): void;
    create(createPlayerDto: CreatePlayerDto, callback: (error: any, result?: any) => void): void;
    findOne(id: string, callback: (error: any, result?: any) => void): void;
    update(id: string, updatePlayerDto: UpdatePlayerDto, callback: (error: any, result?: any) => void): void;
    delete(id: string, callback: (error: any, result?: any) => void): void;
}
