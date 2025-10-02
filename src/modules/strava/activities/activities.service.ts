import { Injectable } from '@nestjs/common';
import { User } from '../../users/user.schema';
import { StravaApiService } from '../common/strava-api.service';

@Injectable()
export class ActivitiesService {
	constructor(private readonly stravaApi: StravaApiService) {}

	async listActivities(user: User, params: any) {
		return this.stravaApi.get(user, '/athlete/activities', params);
	}
}
