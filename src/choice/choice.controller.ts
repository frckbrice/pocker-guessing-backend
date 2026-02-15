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
import { ChoiceService } from './choice.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';

@Controller('choice')
export class ChoiceController {
  constructor(private readonly choiceService: ChoiceService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createChoiceDto: CreateChoiceDto) {
    const choice = await this.choiceService.create(createChoiceDto);
    if (!choice) {
      throw new BadRequestException('Unable to create choice');
    }
    return choice;
  }

  @Get()
  findAll() {
    return this.choiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const choice = await this.choiceService.findChoice(id);
    if (!choice) {
      throw new NotFoundException('Choice not found');
    }
    return choice;
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateChoiceDto: UpdateChoiceDto,
  ) {
    return this.choiceService.update(id, updateChoiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.choiceService.remove(id);
  }
}
