"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRankingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ranking_dto_1 = require("./create-ranking.dto");
class UpdateRankingDto extends (0, swagger_1.PartialType)(create_ranking_dto_1.CreateRankingDto) {
}
exports.UpdateRankingDto = UpdateRankingDto;
//# sourceMappingURL=update-ranking.dto.js.map