import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, UnauthorizedException, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './Users.Service';
import { User } from 'src/schema/Users_s';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginDto } from 'src/dto/login.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async signup(@Body() user: CreateUserDto) {
        try {
            // DTO validation passed
            return await this.userService.createUser(user as User);
        } catch (error) {
            console.error('Signup Error:', error);
            throw new UnauthorizedException(error.message || 'Signup failed');
        }
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() req: LoginDto) {
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
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        // Users can read only their own profile, or ADMIN can read any
        if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
            throw new UnauthorizedException('You can only view your own profile');
        }
        // We need a method in service to find by ID, not just username
        return this.userService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('profilePicture', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                cb(null, `user-${uniqueSuffix}${ext}`);
            }
        })
    }))
    async update(@Param('id') id: string, @Body() data: User, @UploadedFile() file: any, @Request() req) {
        // Users can update only their own name, or ADMIN can update anything
        if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
            throw new UnauthorizedException('You can only update your own profile');
        }

        if (file) {
            // Set the full URL for the profile picture
            const protocol = req.protocol;
            const host = req.get('host');
            data.profilePicture = `${protocol}://${host}/uploads/${file.filename}`;
        }

        return this.userService.updateUser(id, data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}

