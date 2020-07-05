import { IsNotEmpty, IsEmail } from 'class-validator';

import { User } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  constructor(partial?: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  toEntity(): User {
    return new User(this);
  }
}
