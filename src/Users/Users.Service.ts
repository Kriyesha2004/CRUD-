import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/Users_s';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async createUser(user: User): Promise<User> {
        console.log('Attempting to create user:', user);
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(user.password, salt);
            const newUser = new this.userModel({ ...user, password: hashedPassword });
            const savedUser = await newUser.save();
            console.log('User saved successfully:', savedUser);
            return savedUser;
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    async findOne(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async readUser(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        console.log(`Found ${users.length} users in DB`);
        return users;
    }

    async updateUser(id: string, data: User): Promise<User | null> {
        console.log(`Updating user ${id} with data:`, data);
        const updatedUser = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
        console.log('Updated user:', updatedUser);
        return updatedUser;
    }

    async deleteUser(id: string): Promise<User | null> {
        console.log(`Deleting user ${id}`);
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
