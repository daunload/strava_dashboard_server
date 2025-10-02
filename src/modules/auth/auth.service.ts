import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
	private clientId = process.env.STRAVA_CLIENT_ID;
	private clientSecret = process.env.STRAVA_CLIENT_SECRET;

	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private readonly httpService: HttpService,
		private jwtService: JwtService,
	) {}

	async exchangeCodeForToken(code: string): Promise<{ access_token: string }> {
		const response = await this.httpService.axiosRef.post(
			'https://www.strava.com/oauth/token',
			{
				client_id: this.clientId,
				client_secret: this.clientSecret,
				code,
				grant_type: 'authorization_code',
			},
		);

		const { access_token, refresh_token, expires_at, athlete } = response.data;

		let user = await this.userModel.findOne({ athleteId: athlete.id });
		if (!user) {
			user = new this.userModel({
				athleteId: athlete.id,
				accessToken: access_token,
				refreshToken: refresh_token,
				expiresAt: expires_at,
			});
		} else {
			user.accessToken = access_token;
			user.refreshToken = refresh_token;
			user.expiresAt = expires_at;
		}

		user.save();

		const payload = { sub: user._id, athleteId: user.athleteId };
		const accessToken = await this.jwtService.signAsync(payload);

		return {
			access_token: accessToken,
		};
	}

	async refreshAccessToken(user: User): Promise<User> {
		const response = await this.httpService.axiosRef.post(
			'https://www.strava.com/oauth/token',
			{
				client_id: this.clientId,
				client_secret: this.clientSecret,
				grant_type: 'refresh_token',
				refresh_token: user.refreshToken,
			},
		);

		const { access_token, refresh_token, expires_at } = response.data;

		user.accessToken = access_token;
		user.refreshToken = refresh_token;
		user.expiresAt = expires_at;

		return user.save();
	}

	async getValidAccessToken(user: User): Promise<string> {
		const dbUser = await this.userModel.findById(user._id).exec();

		if (!dbUser) throw new Error('User not found');

		const now = Math.floor(Date.now() / 1000);

		if (dbUser.expiresAt > now) {
			// ✅ access_token 아직 유효
			console.log(dbUser.accessToken);
			return dbUser.accessToken;
		}

		// ✅ access_token 만료 → refresh_token으로 새 토큰 발급
		const { data } = await firstValueFrom(
			this.httpService.post('https://www.strava.com/oauth/token', {
				client_id: this.clientId,
				client_secret: this.clientSecret,
				grant_type: 'refresh_token',
				refresh_token: dbUser.refreshToken,
			}),
		);

		dbUser.accessToken = data.access_token;
		dbUser.refreshToken = data.refresh_token;
		dbUser.expiresAt = data.expires_at;
		await dbUser.save();

		return dbUser.accessToken;
	}
}
