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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("./entities/player.entity");
let PlayerService = class PlayerService {
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    findAll(callback) {
        this.playerRepository.find()
            .then(players => {
            callback(null, players);
        })
            .catch(error => {
            callback(error);
        });
    }
    create(createPlayerDto, callback) {
        if (!createPlayerDto.id) {
            return callback(new common_1.BadRequestException('L\'identifiant du joueur n\'est pas valide'));
        }
        this.playerRepository.findOne({ where: { id: createPlayerDto.id } }).then(existingPlayer => {
            if (existingPlayer) {
                return callback(new common_1.ConflictException('Le joueur existe déjà'));
            }
            this.playerRepository.find().then(players => {
                const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
                const averageRank = players.length ? Math.round(totalRank / players.length) : 0;
                const player = new player_entity_1.Player();
                player.id = createPlayerDto.id;
                player.rank = createPlayerDto.rank ?? averageRank;
                this.playerRepository.save(player).then(savedPlayer => {
                    callback(null, savedPlayer);
                }).catch(error => {
                    callback(error);
                });
            }).catch(error => {
                callback(error);
            });
        }).catch(error => {
            callback(error);
        });
    }
    findOne(id, callback) {
        if (!id) {
            return callback(new common_1.BadRequestException('L\'identifiant du joueur n\'est pas valide'));
        }
        this.playerRepository.findOne({ where: { id: id } })
            .then(player => {
            if (!player) {
                return callback(new common_1.UnprocessableEntityException('Le joueur n\'existe pas'));
            }
            callback(null, player);
        })
            .catch(error => {
            callback(error);
        });
    }
    update(id, updatePlayerDto, callback) {
        this.playerRepository.findOne({ where: { id: id } })
            .then(player => {
            if (!player) {
                return callback(new common_1.UnprocessableEntityException('Le joueur n\'existe pas'));
            }
            if (updatePlayerDto.id && updatePlayerDto.id !== id) {
                return callback(new common_1.BadRequestException('Modification de l\'ID non autorisée'));
            }
            Object.assign(player, updatePlayerDto);
            this.playerRepository.save(player).then(updatedPlayer => {
                callback(null, updatedPlayer);
            }).catch(error => {
                callback(error);
            });
        })
            .catch(error => {
            callback(error);
        });
    }
    delete(id, callback) {
        this.playerRepository.findOne({ where: { id: id } })
            .then(player => {
            if (!player) {
                return callback(new common_1.UnprocessableEntityException('Le joueur n\'existe pas'));
            }
            this.playerRepository.delete({ id: id })
                .then(result => {
                if (result.affected === 0) {
                    return callback(new common_1.BadRequestException('Erreur lors de la suppression du joueur'));
                }
                callback(null, result);
            })
                .catch(error => {
                callback(error);
            });
        })
            .catch(error => {
            callback(error);
        });
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlayerService);
//# sourceMappingURL=player.service.js.map