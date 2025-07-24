import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { IUserRepository } from '../users/repositories/user.repository.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    phone: '123456789',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '123456789',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get('IUserRepository');
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '123456789',
      };

      const hashedPassword = 'hashedPassword123';
      const accessToken = 'jwt-token-123';

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(accessToken);

      // Mock bcrypt.hash
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        user: mockUserWithoutPassword,
        access_token: accessToken,
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto: RegisterDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const accessToken = 'jwt-token-123';

      userRepository.findByEmail.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(accessToken);

      // Mock bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: mockUserWithoutPassword,
        access_token: accessToken,
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Mock bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException if user account is inactive', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const inactiveUser = { ...mockUser, active: false };
      userRepository.findByEmail.mockResolvedValue(inactiveUser);

      // Mock bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Mock bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      userRepository.findByEmail.mockResolvedValue(mockUser);

      // Mock bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException if user account is inactive', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const inactiveUser = { ...mockUser, active: false };
      userRepository.findByEmail.mockResolvedValue(inactiveUser);

      // Mock bcrypt.compare
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('findUserById', () => {
    it('should return user without password if user exists', async () => {
      const userId = '1';

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findUserById(userId);

      expect(result).toEqual(mockUserWithoutPassword);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null if user not found', async () => {
      const userId = '999';

      userRepository.findById.mockResolvedValue(null);

      const result = await service.findUserById(userId);

      expect(result).toBeNull();
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });
  });
}); 