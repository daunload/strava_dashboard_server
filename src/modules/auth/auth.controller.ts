import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('strava')
	async stravaLogin(@Res() res: Response) {
		const redirectUri = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&approval_prompt=force&scope=read,activity:read_all`;
		return res.redirect(redirectUri);
	}

	@Get('strava/callback')
	async stravaCallback(@Query('code') code: string, @Res() res: Response) {
		const { access_token } = await this.authService.exchangeCodeForToken(code);

		return res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${access_token}`);
	}
}
