import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto, LogInResponseDto } from './dtos/log-in.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findByIdOrFail(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new BadRequestException('The user was not found');
    return user;
  }

  async findByIdAndToken(id: number, token: string): Promise<User> {
    return this.usersRepository.findOne({ id, token });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    await this.validateUniqueEmail(createUserDto.email);
    return this.usersRepository.save(createUserDto.toEntity());
  }

  private async validateUniqueEmail(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('The email provided is already in use');
    }
  }

  async logIn(logInRequestDto: LogInRequestDto): Promise<LogInResponseDto> {
    const { email, password } = logInRequestDto;
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException(
        'There is no user registered with the email provided',
      );
    }
    if (!(await user.isSamePassword(password))) {
      throw new BadRequestException('Invalid password');
    }
    const token = this.jwtService.sign({ id: user.id });
    await this.updateToken(user, token);
    return { token };
  }

  private async updateToken(user: User, token: string): Promise<void> {
    user.token = token;
    await this.usersRepository.save(user);
  }

  async logOut(user: User): Promise<void> {
    await this.updateToken(user, null);
  }
}
