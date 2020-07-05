import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IncomingMessage } from 'http';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtPayload } from './dtos/log-in.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: IncomingMessage, payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const token = request.headers.authorization.split(' ')[1];
    const user = await this.usersService.findByIdAndToken(id, token);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
