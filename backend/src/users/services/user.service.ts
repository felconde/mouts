import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserRepository } from '../repositories/user.repository.interface';
import { ICacheService } from '../../shared/cache/cache.interface';
import { LoggerService } from '../../shared/logger/logger.service';

@Injectable()
export class UserService {
  private readonly CACHE_PREFIX = 'user:';
  private readonly CACHE_TTL = 300;

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICacheService') private readonly cacheService: ICacheService,
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    this.logger.log('Creating new user', 'USER_SERVICE', { email: createUserDto.email });

    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      this.logger.warn('User creation failed: email already exists', 'USER_SERVICE', { email: createUserDto.email });
      throw new ConflictException('Email already exists');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    const user = await this.userRepository.create(userData);
    
    // Remover senha do cache e resposta
    const { password, ...userWithoutPassword } = user;
    
    await this.cacheService.set(
      `${this.CACHE_PREFIX}${user.id}`,
      userWithoutPassword,
      this.CACHE_TTL,
    );
    
    await this.cacheService.delete(`${this.CACHE_PREFIX}all`);

    this.logger.log('User created successfully', 'USER_SERVICE', { userId: user.id, email: user.email });
    this.logger.logCache('set', `${this.CACHE_PREFIX}${user.id}`);
    this.logger.logCache('delete', `${this.CACHE_PREFIX}all`);

    return userWithoutPassword;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const cacheKey = `${this.CACHE_PREFIX}all`;
    
    let users = await this.cacheService.get<Omit<User, 'password'>[]>(cacheKey);
    if (!users) {
      this.logger.logCache('miss', cacheKey);
      const usersWithPassword = await this.userRepository.findAll();
      // Remover senhas de todos os usuários
      users = usersWithPassword.map(({ password, ...user }) => user);
      await this.cacheService.set(cacheKey, users, this.CACHE_TTL);
      this.logger.logCache('set', cacheKey);
    } else {
      this.logger.logCache('hit', cacheKey);
    }

    this.logger.log('Retrieved all users', 'USER_SERVICE', { count: users.length });
    return users;
  }

  async findById(id: string): Promise<Omit<User, 'password'>> {
    const cacheKey = `${this.CACHE_PREFIX}${id}`;
    
    let user = await this.cacheService.get<Omit<User, 'password'>>(cacheKey);
    if (!user) {
      const userWithPassword = await this.userRepository.findById(id);
      if (!userWithPassword) {
        throw new NotFoundException('User not found');
      }
      
      // Remover senha
      const { password, ...userWithoutPassword } = userWithPassword;
      user = userWithoutPassword;
      
      await this.cacheService.set(cacheKey, user, this.CACHE_TTL);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const userWithPassword = await this.userRepository.update(id, updateUserDto);
    if (!userWithPassword) {
      throw new NotFoundException('User not found');
    }

    // Remover senha
    const { password, ...user } = userWithPassword;

    await this.cacheService.delete(`${this.CACHE_PREFIX}${id}`);
    await this.cacheService.delete(`${this.CACHE_PREFIX}all`);

    return user;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    await this.cacheService.delete(`${this.CACHE_PREFIX}${id}`);
    await this.cacheService.delete(`${this.CACHE_PREFIX}all`);
  }
} 