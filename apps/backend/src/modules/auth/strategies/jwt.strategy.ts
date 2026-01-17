/**
 * @file jwt.strategy.ts
 * @description Passport JWT strategy for token validation
 * @task TASK-007, TASK-046
 * @design_state_version 3.7.0
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRoleType } from '../decorators/roles.decorator';

interface JwtPayload {
  sub: string;
  role?: UserRoleType;
}

export interface JwtUser {
  userId: string;
  role: UserRoleType;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      userId: payload.sub,
      role: payload.role || 'user',
    };
  }
}
