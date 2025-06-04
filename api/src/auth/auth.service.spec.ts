import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const hashedPassword = 'hashedPassword123';
    const createdUser = {
      id: '1',
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const token = 'jwt-token';

    it('should register a new user successfully', async () => {
      // Mock findUnique to return null (user doesn't exist)
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Mock bcrypt.hash
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Mock create to return the new user
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      // Mock JWT sign
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.register(createUserDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: createdUser.id,
        email: createdUser.email,
      });
      expect(result).toEqual({
        access_token: token,
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(createdUser);

      await expect(service.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const user = {
      id: '1',
      name: 'Test User',
      email: loginDto.email,
      password: 'hashedPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const token = 'jwt-token';

    it('should login successfully with valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(result).toEqual({
        access_token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    const userId = '1';
    const user = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return user data if user exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.validateUser(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    });

    it('should return null if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toBeNull();
    });
  });
});
