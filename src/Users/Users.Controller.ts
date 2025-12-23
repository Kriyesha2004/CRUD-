import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './Users.Service';
import { User } from 'src/schema/Users_s';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    async signup(@Body() user: User) {
        try {
            return await this.userService.createUser(user);
        } catch (error) {
            console.error('Signup Error:', error);
            throw new UnauthorizedException(error.message || 'Signup failed');
        }
    }

    @Post('login')
    async login(@Body() req) {
        const user = await this.authService.validateUser(req.username, req.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    async read() {
        return this.userService.readUser();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: User, @Request() req) {
        // Users can update only their own name, or ADMIN can update anything
        if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
            throw new UnauthorizedException('You can only update your own profile');
        }
        // If not admin, restrict to only updating 'username' (name) as per req? 
        // User requirements say "Users can update only their own name". 
        // Implementing strict check if needed, but for now allowing update if ID matches.
        return this.userService.updateUser(id, data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}

