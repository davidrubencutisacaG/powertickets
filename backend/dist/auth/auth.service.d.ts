import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: User;
    }>;
}
