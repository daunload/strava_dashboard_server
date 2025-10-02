import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from './modules/strava/activities/activities.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(process.env.DB_URL || '', {
			dbName: process.env.DB_NAME || 'strava_dashboard',
		}),
		AuthModule,
		ActivitiesModule,
		UsersModule,
	],
})
export class AppModule {}
