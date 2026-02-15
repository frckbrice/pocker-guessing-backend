import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateGameRoundDto {
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  gamesession_id: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  round_number: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  number_of_proposals: number;

  // @IsNumber()
  // @IsNotEmpty()
  // proposals: string;
}
