import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { AuthModule } from '../../auth/auth.module';
import { StravaApiService } from '../common/strava-api.service';

@Module({
	imports: [HttpModule, AuthModule],
	controllers: [ActivitiesController],
	providers: [ActivitiesService, StravaApiService],
})
export class ActivitiesModule {}
