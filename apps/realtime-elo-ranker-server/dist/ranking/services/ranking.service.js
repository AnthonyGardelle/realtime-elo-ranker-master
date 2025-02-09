"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const player_service_1 = require("../../player/services/player.service");
const events_service_1 = require("../../events/services/events.service");
let RankingService = class RankingService {
    constructor(playerService, eventService) {
        this.playerService = playerService;
        this.eventService = eventService;
        this.rankings = [];
        this.initializeRankings();
    }
    initializeRankings() {
        this.playerService.findAll((error, players) => {
            if (!error && players) {
                this.rankings = players.sort((a, b) => b.rank - a.rank);
            }
            else {
                console.error('Error while initializing rankings:', error);
            }
        });
    }
    getRanking(callback) {
        callback(null, this.rankings);
    }
    updateRanking(player) {
        const index = this.rankings.findIndex(p => p.id === player.id);
        if (index !== -1) {
            this.rankings[index].rank = player.rank;
        }
        else {
            this.rankings.push(player);
        }
        this.rankings.sort((a, b) => b.rank - a.rank);
    }
    getRankingUpdates() {
        return (0, rxjs_1.fromEvent)(this.eventService.getRankingEmitter(), 'rankingUpdate').pipe((0, operators_1.map)((player) => {
            this.updateRanking({ id: player.id, rank: player.rank });
            const messageData = {
                type: 'RankingUpdate',
                player
            };
            return new MessageEvent('message', {
                data: messageData,
                lastEventId: '',
                origin: '',
            });
        }));
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        events_service_1.EventsService])
], RankingService);
//# sourceMappingURL=ranking.service.js.map