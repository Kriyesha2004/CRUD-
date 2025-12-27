import { UsersService } from './Users.Service';
import { User } from 'src/schema/Users_s';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginDto } from 'src/dto/login.dto';
export declare class UsersController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UsersService, authService: AuthService);
    signup(user: CreateUserDto): Promise<User>;
    login(req: LoginDto): Promise<{
        access_token: string;
    }>;
    read(): Promise<User[]>;
    findOne(id: string, req: any): Promise<import("src/schema/Users_s").UserDocument | null>;
    update(id: string, data: User, file: any, req: any): Promise<User | null>;
    delete(id: string): Promise<User | null>;
}
