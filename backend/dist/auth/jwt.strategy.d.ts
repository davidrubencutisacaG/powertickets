import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usersRepository;
    constructor(configService: ConfigService, usersRepository: Repository<User>);
    validate(payload: {
        sub: string;
    }): Promise<User | null>;
}
export {};
