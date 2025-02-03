import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    findAll(): Promise<unknown>;
    create(createMatchDto: CreateMatchDto): Promise<unknown>;
    findOne(id: string): Promise<unknown>;
    update(id: string, updateMatchDto: UpdateMatchDto): void;
    remove(id: string): void;
}
