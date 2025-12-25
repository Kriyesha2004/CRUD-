import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/Users_s';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(user: User): Promise<User>;
    findOne(username: string): Promise<User | null>;
    findById(id: string): Promise<UserDocument | null>;
    readUser(): Promise<User[]>;
    updateUser(id: string, data: Partial<User>): Promise<User | null>;
    deleteUser(id: string): Promise<User | null>;
}
