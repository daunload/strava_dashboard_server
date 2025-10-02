import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

	async findByAthleteId(athleteId?: number): Promise<User | null> {
		if (!athleteId) return null;
		return this.userModel.findOne({ athleteId }).exec();
	}

	async createOrUpdate(userData: Partial<User>): Promise<User> {
		let user = await this.findByAthleteId(userData.athleteId);

		if (!user) user = new this.userModel(userData);
		else Object.assign(user, userData);

		return user.save();
	}

	async findAll(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	async deleteByAthleteId(athleteId: number): Promise<void> {
		await this.userModel.deleteOne({ athleteId }).exec();
	}
}
