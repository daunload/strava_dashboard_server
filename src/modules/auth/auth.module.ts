import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		ConfigModule,
		HttpModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const secret = configService.get<string>('JWT_SECRET');
				if (!secret) throw new Error('JWT_SECRET not set');

				return {
					global: true,
					secret: secret,
					signOptions: { expiresIn: '1h' },
				};
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
