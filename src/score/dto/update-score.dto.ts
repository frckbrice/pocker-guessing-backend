import { PartialType } from '@nestjs/mapped-types';
import { CreateScoreDto } from './create-score.dto';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateScoreDto extends PartialType(CreateScoreDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  home_player_score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  guess_player_score?: number;

  @IsOptional()
  @IsUUID()
  gamesession_id?: string;
}
