import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GameRoundService } from './game_round.service';
import { CreateGameRoundDto } from './dto/create-game_round.dto';
import { UpdateGameRoundDto } from './dto/update-game_round.dto';

@Controller('game-round')
export class GameRoundController {
  constructor(private readonly gameRoundService: GameRoundService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGameRoundDto: CreateGameRoundDto) {
    const round = await this.gameRoundService.createRound(createGameRoundDto);
    if (!round) {
      throw new BadRequestException('Unable to create round');
    }
    return round;
  }

  @Get('session/:id')
  findAll(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gameRoundService.findAll(id);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const round = await this.gameRoundService.findOne(id);
    if (!round) {
      throw new NotFoundException('Round not found');
    }
    return round;
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGameRoundDto: UpdateGameRoundDto,
  ) {
    return this.gameRoundService.update(id, updateGameRoundDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.gameRoundService.remove(id);
  }
}
