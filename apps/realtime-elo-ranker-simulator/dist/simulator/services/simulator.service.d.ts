import { OnApplicationBootstrap } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
export declare class SimulatorService implements OnApplicationBootstrap {
    private readonly httpService;
    private players;
    private registeredPlayers;
    private apiUrl;
    constructor(httpService: HttpService);
    onApplicationBootstrap(): Promise<void>;
    private registerAllPlayers;
    private simulateMatch;
    private selectRandomPlayers;
}
