import { MatchService } from '../services/match.service';
import { CreateMatchDto } from '../dto/create-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    create(createMatchDto: CreateMatchDto): Promise<unknown>;
}
