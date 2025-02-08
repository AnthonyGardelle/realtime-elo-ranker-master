"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const playersData = __importStar(require("../data/players.json"));
let SimulatorService = class SimulatorService {
    constructor(httpService) {
        this.httpService = httpService;
        this.players = [];
        this.registeredPlayers = [];
        this.apiUrl = 'http://localhost:3000/api';
        this.players = playersData.players;
    }
    async onApplicationBootstrap() {
        await this.registerAllPlayers();
        setInterval(() => this.simulateMatch(), 500);
    }
    async registerAllPlayers() {
        for (const player of this.players) {
            try {
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.apiUrl}/player`, { id: player }).pipe((0, rxjs_1.catchError)(error => {
                    console.error(`Erreur lors de la création du joueur ${player}:`, error?.response?.data || error?.message);
                    return [];
                })));
                this.registeredPlayers.push(player);
                console.log(`Joueur enregistré: ${player}`);
            }
            catch (error) {
                console.error(`Impossible d'enregistrer le joueur ${player}`);
            }
        }
    }
    simulateMatch() {
        if (this.registeredPlayers.length < 2) {
            console.log('Pas assez de joueurs enregistrés pour simuler un match');
            return;
        }
        const [player1, player2] = this.selectRandomPlayers();
        const isDraw = Math.random() < 0.1;
        const matchResult = {
            winner: isDraw ? player1 : (Math.random() < 0.5 ? player1 : player2),
            loser: isDraw ? player2 : (Math.random() < 0.5 ? player2 : player1),
            draw: isDraw
        };
        this.httpService.post(`${this.apiUrl}/match`, matchResult)
            .pipe((0, rxjs_1.catchError)(error => {
            console.error('Erreur lors de l\'envoi du match:', error?.response?.data || error?.message);
            return [];
        }))
            .subscribe(() => {
            console.log('Match simulé:', matchResult);
        });
    }
    selectRandomPlayers() {
        const availablePlayers = [...this.registeredPlayers];
        const player1Index = Math.floor(Math.random() * availablePlayers.length);
        const player1 = availablePlayers[player1Index];
        availablePlayers.splice(player1Index, 1);
        const player2Index = Math.floor(Math.random() * availablePlayers.length);
        const player2 = availablePlayers[player2Index];
        return [player1, player2];
    }
};
exports.SimulatorService = SimulatorService;
exports.SimulatorService = SimulatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], SimulatorService);
//# sourceMappingURL=simulator.service.js.map