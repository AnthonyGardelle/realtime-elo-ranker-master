import { UpdatePlayerDto } from './update-player.dto';
import { CreatePlayerDto } from './create-player.dto';
import { PartialType } from '@nestjs/mapped-types';

describe('UpdatePlayerDto', () => {
  let dto: UpdatePlayerDto;

  beforeEach(() => {
    dto = new UpdatePlayerDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
    expect(dto).toBeInstanceOf(UpdatePlayerDto);
  });

  it('should have rank property', () => {
    const rank = 1200;
    dto.rank = rank;
    expect(dto.rank).toBe(rank);
  });

  it('should extend PartialType of CreatePlayerDto', () => {
    const updateDto = new UpdatePlayerDto();
    
    // Verify it's an instance of UpdatePlayerDto
    expect(updateDto).toBeInstanceOf(UpdatePlayerDto);
    
    // Verify rank property works
    updateDto.rank = 1200;
    expect(updateDto.rank).toBe(1200);
    
    // Verify inheritance from CreatePlayerDto through PartialType
    const prototype = Object.getPrototypeOf(UpdatePlayerDto);
    expect(prototype.name).toContain('PartialCreatePlayerDto');
  });

  it('should allow partial updates', () => {
    // Test rank only
    const rankOnly = new UpdatePlayerDto();
    rankOnly.rank = 1200;
    expect(rankOnly.rank).toBe(1200);
    expect(rankOnly.id).toBeUndefined();

    // Test empty DTO
    const emptyDto = new UpdatePlayerDto();
    expect(emptyDto.id).toBeUndefined();
    expect(emptyDto.rank).toBeUndefined();
  });
});