import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { GuessService } from './guess.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';

@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGuessDto: CreateGuessDto) {
    const guess = await this.guessService.create(createGuessDto);
    if (!guess) {
      throw new BadRequestException('Unable to create guess');
    }
    return guess;
  }

  @Get()
  findAll() {
    return this.guessService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.guessService.findOne(id);
  // }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGuessDto: UpdateGuessDto,
  ) {
    return this.guessService.update(id, updateGuessDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.guessService.remove(+id);
  // }
}
