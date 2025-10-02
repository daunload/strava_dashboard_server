import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('activities')
export class ActivitiesController {
	constructor(private readonly activitiesService: ActivitiesService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get()
	async getActivities(
		@Req() req,
		@Query('before') before?: number,
		@Query('after') after?: number,
		@Query('page') page = 1,
		@Query('per_page') per_page = 30,
	) {
		const user = req.user;

		return this.activitiesService.listActivities(user, {
			before,
			after,
			page,
			per_page,
		});
	}
}
