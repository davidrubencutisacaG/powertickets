import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../database/entities/user.entity';
import { Organizer, OrganizerStatus } from '../database/entities/organizer.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Organizer)
    private readonly organizersRepository: Repository<Organizer>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Prevenir creación de usuarios ADMIN desde registro público
    const role = dto.role === UserRole.ADMIN ? UserRole.BUYER : dto.role;

    const password = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({ ...dto, password, role });
    const savedUser = await this.usersRepository.save(user);

    // Si el usuario se registra como ORGANIZER, crear registro Organizer
    if (role === UserRole.ORGANIZER) {
      const organizer = this.organizersRepository.create({
        user: savedUser,
        status: OrganizerStatus.PENDING,
      });
      await this.organizersRepository.save(organizer);
    }

    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { sub: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      accessToken: token, // Mantener para compatibilidad
      user,
    };
  }
}
