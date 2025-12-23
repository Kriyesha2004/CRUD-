import { UsersService } from './Users.Service';
import { User } from 'src/schema/Users_s';
import { AuthService } from '../auth/auth.service';
export declare class UsersController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UsersService, authService: AuthService);
    signup(user: User): Promise<User>;
    login(req: any): Promise<{
        access_token: string;
    }>;
    read(): Promise<User[]>;
    update(id: string, data: User, req: any): Promise<User | null>;
    delete(id: string): Promise<User | null>;
}
