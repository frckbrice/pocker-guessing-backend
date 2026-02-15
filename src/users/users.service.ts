import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import User from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) { }

  async create_user(createUserDto: CreateUserDto) {
    const existingUser = new this.userModel({
      username: createUserDto.username,
    });

    // we need to check if the username is already taken, if so we return the existing user
    const foundUser = await this.userModel.findOne({
      where: { username: createUserDto.username },
    });

    if (foundUser)
      return foundUser;

    // if not we create a new user and return it
    const newUser = await existingUser.save();

    if (newUser)
      return existingUser;
  }

  findAll() {
    return this.userModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findOne(id: string) {
    if (id) return await this.userModel.findByPk(id);
    else return null;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: string) {
    const deleted = await this.userModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
