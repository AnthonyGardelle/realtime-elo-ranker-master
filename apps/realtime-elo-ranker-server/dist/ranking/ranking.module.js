"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const ranking_service_1 = require("./services/ranking.service");
const ranking_controller_1 = require("./controllers/ranking.controller");
const player_entity_1 = require("../player/entities/player.entity");
const player_module_1 = require("../player/player.module");
const events_module_1 = require("../events/events.module");
let RankingModule = class RankingModule {
};
exports.RankingModule = RankingModule;
exports.RankingModule = RankingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([player_entity_1.Player]),
            event_emitter_1.EventEmitterModule.forRoot(),
            player_module_1.PlayerModule,
            events_module_1.EventsModule
        ],
        controllers: [ranking_controller_1.RankingController],
        providers: [ranking_service_1.RankingService],
        exports: [ranking_service_1.RankingService]
    })
], RankingModule);
//# sourceMappingURL=ranking.module.js.map