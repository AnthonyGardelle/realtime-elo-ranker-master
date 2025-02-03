"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMatchDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_match_dto_1 = require("./create-match.dto");
class UpdateMatchDto extends (0, mapped_types_1.PartialType)(create_match_dto_1.CreateMatchDto) {
}
exports.UpdateMatchDto = UpdateMatchDto;
//# sourceMappingURL=update-match.dto.js.map