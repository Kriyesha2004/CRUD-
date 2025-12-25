import { Injectable } from '@nestjs/common';
import { UsersService } from '../Users/Users.Service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            // Convert to plain object to ensure we get _id and clean properties
            const userObj = (user as any).toObject ? (user as any).toObject() : user;
            const { password, ...result } = userObj;
            return result;
        }
        return null;
    }

    async login(user: any) {
        console.log('Login Payload Construction. User ID:', user._id);
        // [SECURITY] Include tokenVersion to allow for session revocation.
        const payload = {
            username: user.username,
            sub: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion || 0
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
