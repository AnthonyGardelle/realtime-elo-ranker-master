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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("../entities/match.entity");
const player_service_1 = require("../../player/services/player.service");
let MatchService = class MatchService {
    constructor(matchRepository, playerService) {
        this.matchRepository = matchRepository;
        this.playerService = playerService;
    }
    handlePlayerError(error, callback, role) {
        if (error instanceof common_1.BadRequestException) {
            return callback(new common_1.BadRequestException(`L'identifiant du joueur ${role} n'est pas valide`));
        }
        else if (error instanceof common_1.UnprocessableEntityException) {
            return callback(new common_1.UnprocessableEntityException(`Le joueur ${role} n'existe pas`));
        }
        else {
            return callback(error);
        }
    }
    calculateElo(winnerRank, loserRank, draw) {
        const K = 32;
        const winnerExpectedScore = 1 / (1 + Math.pow(10, (loserRank - winnerRank) / 400));
        const loserExpectedScore = 1 / (1 + Math.pow(10, (winnerRank - loserRank) / 400));
        let newWinnerRank, newLoserRank;
        if (draw) {
            newWinnerRank = Math.round(winnerRank + K * (0.5 - winnerExpectedScore));
            newLoserRank = Math.round(loserRank + K * (0.5 - loserExpectedScore));
        }
        else {
            newWinnerRank = Math.round(winnerRank + K * (1 - winnerExpectedScore));
            newLoserRank = Math.round(loserRank + K * (0 - loserExpectedScore));
        }
        return { newWinnerRank, newLoserRank };
    }
    create(createMatchDto, callback) {
        this.playerService.findOne(createMatchDto.winner, (error, winner) => {
            if (error) {
                return this.handlePlayerError(error, callback, 'gagnant');
            }
            this.playerService.findOne(createMatchDto.loser, (error, loser) => {
                if (error) {
                    return this.handlePlayerError(error, callback, 'perdant');
                }
                if (winner.id === loser.id) {
                    return callback(new common_1.BadRequestException('Le gagnant et le perdant ne peuvent pas être le même joueur'));
                }
                const { newWinnerRank, newLoserRank } = this.calculateElo(winner.rank, loser.rank, createMatchDto.draw);
                winner.rank = newWinnerRank;
                loser.rank = newLoserRank;
                const match = new match_entity_1.Match();
                match.winnerId = winner.id;
                match.winnerRank = winner.rank;
                match.loserId = loser.id;
                match.loserRank = loser.rank;
                match.draw = createMatchDto.draw;
                this.matchRepository.save(match).then(savedMatch => {
                    const updateWinnerDto = {
                        id: winner.id,
                        rank: newWinnerRank
                    };
                    const updateLoserDto = {
                        id: loser.id,
                        rank: newLoserRank
                    };
                    this.playerService.update(updateWinnerDto, (error) => {
                        if (error) {
                            return callback(error);
                        }
                        this.playerService.update(updateLoserDto, (error) => {
                            if (error) {
                                return callback(error);
                            }
                            callback(null, savedMatch);
                        });
                    });
                }).catch(error => callback(error));
            });
        });
    }
    findOne(id, callback) {
        if (!id) {
            return callback(new common_1.BadRequestException('L\'identifiant du match n\'est pas valide'));
        }
        this.matchRepository.findOne({ where: { id: id } })
            .then(match => {
            if (!match) {
                return callback(new common_1.UnprocessableEntityException('Le match n\'existe pas'));
            }
            callback(null, match);
        })
            .catch(error => {
            callback(error);
        });
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        player_service_1.PlayerService])
], MatchService);
//# sourceMappingURL=match.service.js.map