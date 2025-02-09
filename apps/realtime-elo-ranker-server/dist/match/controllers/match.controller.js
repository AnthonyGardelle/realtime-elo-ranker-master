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
exports.MatchController = void 0;
const common_1 = require("@nestjs/common");
const match_service_1 = require("../services/match.service");
const create_match_dto_1 = require("../dto/create-match.dto");
let MatchController = class MatchController {
    constructor(matchService) {
        this.matchService = matchService;
    }
    create(createMatchDto) {
        return new Promise((resolve, reject) => {
            this.matchService.create(createMatchDto, (error, result) => {
                if (error) {
                    let errorResponse;
                    if (error instanceof common_1.UnprocessableEntityException) {
                        errorResponse = {
                            code: 422,
                            message: error.message
                        };
                        reject(new common_1.UnprocessableEntityException(errorResponse));
                    }
                    else if (error instanceof common_1.BadRequestException) {
                        errorResponse = {
                            code: 400,
                            message: error.message
                        };
                        reject(new common_1.BadRequestException(errorResponse));
                    }
                    else {
                        reject(error);
                    }
                }
                else {
                    resolve({ "winner": { "id": result.winnerId, "rank": result.winnerRank }, "loser": { "id": result.loserId, "rank": result.loserRank } });
                }
            });
        });
    }
};
exports.MatchController = MatchController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_match_dto_1.CreateMatchDto]),
    __metadata("design:returntype", void 0)
], MatchController.prototype, "create", null);
exports.MatchController = MatchController = __decorate([
    (0, common_1.Controller)('api/match'),
    __metadata("design:paramtypes", [match_service_1.MatchService])
], MatchController);
//# sourceMappingURL=match.controller.js.map