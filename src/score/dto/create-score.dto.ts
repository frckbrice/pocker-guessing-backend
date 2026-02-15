import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateScoreDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  home_player_score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  guess_player_score?: number;

  @IsNotEmpty()
  @IsUUID()
  gamesession_id: string;
}
