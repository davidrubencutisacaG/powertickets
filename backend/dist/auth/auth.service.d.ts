import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/entities/user.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersRepository;
    private readonly organizersRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<User>, organizersRepository: Repository<Organizer>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        accessToken: string;
        user: User;
    }>;
}
