import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const expectedResult = {
        access_token: 'jwt-token',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.register(createUserDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };
      const expectedResult = {
        access_token: 'jwt-token',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      // Arrange
      const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
      const req = { user };

      // Act
      const result = controller.getProfile(req);

      // Assert
      expect(result).toEqual(user);
    });
  });
});
