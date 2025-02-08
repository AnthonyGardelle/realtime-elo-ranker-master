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
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../services/player.service");
const create_player_dto_1 = require("../dto/create-player.dto");
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    create(createPlayerDto) {
        return new Promise((resolve, reject) => {
            this.playerService.create(createPlayerDto, (error, result) => {
                if (error) {
                    if (error instanceof common_1.BadRequestException) {
                        resolve({ code: 400, message: error.message });
                    }
                    else if (error instanceof common_1.ConflictException) {
                        resolve({ code: 409, message: error.message });
                    }
                    else {
                        reject(error);
                    }
                }
                else {
                    resolve(result);
                }
            });
        });
    }
};
exports.PlayerController = PlayerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_player_dto_1.CreatePlayerDto]),
    __metadata("design:returntype", void 0)
], PlayerController.prototype, "create", null);
exports.PlayerController = PlayerController = __decorate([
    (0, common_1.Controller)('api/player'),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
//# sourceMappingURL=player.controller.js.map