import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    findAll(): Promise<unknown>;
    create(createPlayerDto: CreatePlayerDto): Promise<unknown>;
    findOne(id: string): Promise<unknown>;
    update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<unknown>;
    remove(id: string): Promise<unknown>;
}
