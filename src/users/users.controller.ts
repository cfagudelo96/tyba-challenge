import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto, LogInResponseDto } from './dtos/log-in.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.register(createUserDto);
  }

  @Post('log-in')
  @HttpCode(200)
  logIn(@Body() logInRequestDto: LogInRequestDto): Promise<LogInResponseDto> {
    return this.usersService.logIn(logInRequestDto);
  }

  @Post('log-out')
  @UseGuards(AuthGuard())
  @HttpCode(204)
  logOut(@Req() request: Request): Promise<void> {
    const { user } = request;
    return this.usersService.logOut(user as User);
  }
}
