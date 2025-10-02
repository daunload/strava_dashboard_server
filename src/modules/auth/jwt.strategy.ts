import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_SECRET');
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret || 'default',
		});
	}

	async validate(payload: any) {
		console.log('jwt strategy validate', payload);
		return { userId: payload.sub, athleteId: payload.athleteId };
	}
}
