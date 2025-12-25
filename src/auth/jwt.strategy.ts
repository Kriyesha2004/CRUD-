import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../Users/Users.Service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey', // In production, use environment variables
        });
    }

    async validate(payload: any) {
        // [SECURITY] Fetch fresh user data to ensure role consistency.
        const user = await this.usersService.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // [SECURITY] Session Revocation Check
        // 1. Version Check: Handles password resets or manual "logout all devices".
        if (payload.tokenVersion !== ((user as any).tokenVersion || 0)) {
            throw new UnauthorizedException('Session revoked. Please login again.');
        }

        // 2. Role Consistency Check: 
        // If the user's role changed in the DB (e.g. promoted to ADMIN), the old token (with USER role) 
        // must be considered invalid to force a re-login and UI update.
        if (payload.role !== user.role) {
            throw new UnauthorizedException('Role changed. Please login again to update permissions.');
        }

        // Return the fresh user object (mapped to what Request expects)
        return { userId: (user as any)._id.toString(), username: user.username, role: user.role };
    }
}
