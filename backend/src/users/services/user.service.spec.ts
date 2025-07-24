import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserRepository } from '../repositories/user.repository.interface';
import { ICacheService } from '../../shared/cache/cache.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let cacheService: jest.Mocked<ICacheService>;

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

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      deletePattern: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'ICacheService',
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get('IUserRepository');
    cacheService = module.get('ICacheService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '123456789',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);
      cacheService.set.mockResolvedValue();
      cacheService.delete.mockResolvedValue();

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUserWithoutPassword);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userRepository.create).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
      expect(cacheService.delete).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    });
  });

  describe('findAll', () => {
    it('should return all users from cache if available', async () => {
      const cachedUsers = [mockUserWithoutPassword];
      cacheService.get.mockResolvedValue(cachedUsers);

      const result = await service.findAll();

      expect(result).toEqual(cachedUsers);
      expect(cacheService.get).toHaveBeenCalledWith('user:all');
    });

    it('should return all users from database if not in cache', async () => {
      cacheService.get.mockResolvedValue(null);
      userRepository.findAll.mockResolvedValue([mockUser]);
      cacheService.set.mockResolvedValue();

      const result = await service.findAll();

      expect(result).toEqual([mockUserWithoutPassword]);
      expect(userRepository.findAll).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return user from cache if available', async () => {
      cacheService.get.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.findById('1');

      expect(result).toEqual(mockUserWithoutPassword);
      expect(cacheService.get).toHaveBeenCalledWith('user:1');
    });

    it('should return user from database if not in cache', async () => {
      cacheService.get.mockResolvedValue(null);
      userRepository.findById.mockResolvedValue(mockUser);
      cacheService.set.mockResolvedValue();

      const result = await service.findById('1');

      expect(result).toEqual(mockUserWithoutPassword);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(cacheService.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      cacheService.get.mockResolvedValue(null);
      userRepository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.update.mockResolvedValue(mockUser);
      cacheService.delete.mockResolvedValue();

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(mockUserWithoutPassword);
      expect(userRepository.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(cacheService.delete).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException if email already exists', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = { ...mockUser, id: '2' };
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.update.mockResolvedValue(null);

      await expect(service.update('1', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      userRepository.delete.mockResolvedValue(true);
      cacheService.delete.mockResolvedValue();

      await service.delete('1');

      expect(userRepository.delete).toHaveBeenCalledWith('1');
      expect(cacheService.delete).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.delete.mockResolvedValue(false);

      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
}); 