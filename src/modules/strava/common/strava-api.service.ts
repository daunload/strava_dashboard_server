import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../users/user.schema';

@Injectable()
export class StravaApiService {
	private readonly BASE_URL = 'https://www.strava.com/api/v3';

	constructor(
		private readonly httpService: HttpService,
		private readonly authService: AuthService,
	) {}

	async get<T>(user: User, endpoint: string, params?: any): Promise<T> {
		const token = await this.authService.getValidAccessToken(user);
		console.log(token);

		const { data } = await firstValueFrom(
			this.httpService.get(`${this.BASE_URL}${endpoint}`, {
				headers: { Authorization: `Bearer ${token}` },
				params,
			}),
		);

		return data;
	}
}
