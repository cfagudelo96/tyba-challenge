import { IsNotEmpty } from 'class-validator';

export class JwtPayload {
  id: number;
}

export class LogInResponseDto {
  token: string;
}

export class LogInRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
