import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createScoreDto: CreateScoreDto) {
    const score = await this.scoreService.create(createScoreDto);
    if (!score) {
      throw new BadRequestException('Unable to create score');
    }
    return score;
  }

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const score = await this.scoreService.findOne(id);
    if (!score) {
      throw new NotFoundException('Score not found');
    }
    return score;
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateScoreDto: UpdateScoreDto,
  ) {
    return this.scoreService.updateById(id, updateScoreDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.scoreService.remove(id);
  }
}
