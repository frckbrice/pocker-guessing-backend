import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { Score } from './models/score.models';
import { InjectModel } from '@nestjs/sequelize';
import { ScoreType } from './interface/score.interface';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class ScoreService {
  constructor(@InjectModel(Score) private scoreModel: typeof Score) { }

  async create(createScoreDto: CreateScoreDto) {
    const score = new this.scoreModel({
      gamesession_id: createScoreDto.gamesession_id,
      home_player_score: createScoreDto.home_player_score ?? 0,
      guess_player_score: createScoreDto.guess_player_score ?? 0,
    });
    return score.save();
  }

  findAll() {
    return this.scoreModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findOne(id: string) {
    return await this.scoreModel.findOne({
      where: {
        gamesession_id: id,
      },
    });
  }

  async update(gamesession_id: string, updateScoreDto: ScoreType) {
    try {
      console.log('update', gamesession_id, updateScoreDto);
      const existingScore = await this.scoreModel.findOne({
        where: {
          gamesession_id: gamesession_id,
        },
      });

      console.log('existingScore', existingScore);
      if (!existingScore) {
        if (updateScoreDto.home_player_isCorrect) {
          const score = new this.scoreModel({
            home_player_score: 1,
            gamesession_id,
          });
          return await score.save();
        } else if (updateScoreDto.guess_player_isCorrect) {
          const score = new this.scoreModel({
            guess_player_score: 1,
            gamesession_id,
          });
          return await score.save();
        }
      } else {
        if (updateScoreDto.guess_player_isCorrect) {
          existingScore.gamesession_id = gamesession_id;
          existingScore.guess_player_score += 1;
        } else if (updateScoreDto.home_player_isCorrect) {
          existingScore.gamesession_id = gamesession_id;
          existingScore.home_player_score += 1;
        }
        return await existingScore.save();
      }
    } catch (error) {
      console.log('error updating score', error);
    }
  }

  async updateById(id: string, updateScoreDto: UpdateScoreDto) {
    const existingScore = await this.scoreModel.findByPk(id);
    if (!existingScore) {
      throw new NotFoundException('Score not found');
    }

    if (typeof updateScoreDto.home_player_score === 'number') {
      existingScore.home_player_score = updateScoreDto.home_player_score;
    }
    if (typeof updateScoreDto.guess_player_score === 'number') {
      existingScore.guess_player_score = updateScoreDto.guess_player_score;
    }
    if (updateScoreDto.gamesession_id) {
      existingScore.gamesession_id = updateScoreDto.gamesession_id;
    }

    return existingScore.save();
  }

  async remove(id: string) {
    const deleted = await this.scoreModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('Score not found');
    }
  }
}
