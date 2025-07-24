import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../users/repositories/user.repository.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { LoggerService } from '../shared/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Omit<User, 'password'>; access_token: string }> {
    this.logger.logAuth('register_attempt', undefined, registerDto.email);

    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      this.logger.warn('Registration failed: email already exists', 'AUTH', { email: registerDto.email });
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const userData = {
      ...registerDto,
      password: hashedPassword,
    };

    const user = await this.userRepository.create(userData);
    
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;

    this.logger.logAuth('register_success', user.id, user.email);

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>; access_token: string }> {
    this.logger.logAuth('login_attempt', undefined, loginDto.email);

    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;

    this.logger.logAuth('login_success', user.id, user.email);

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.warn('User validation failed: user not found', 'AUTH', { email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn('User validation failed: invalid password', 'AUTH', { email, userId: user.id });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.active) {
      this.logger.warn('User validation failed: inactive account', 'AUTH', { email, userId: user.id });
      throw new UnauthorizedException('User account is inactive');
    }

    return user;
  }

  async findUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 