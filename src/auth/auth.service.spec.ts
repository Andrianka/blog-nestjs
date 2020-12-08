import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import CredentialsDto from './dto/credentials.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockJwtService = {
  sign: jest.fn(),
};

const mockUsersService = {
  getByUsername: jest.fn(),
  checkByUsername: jest.fn(),
  create: jest.fn(),
};

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  let bcryptHash: jest.Mock;

  const mockCredentialsDto: CredentialsDto = {
    username: 'user_test',
    password: 'user_pass',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#login', () => {
    it('should sign payload and return access token', () => {
      const tokenWithPayload = 'tokenWithPayload';
      const payloadToLogin = ({
        id: 1,
        username: 'user_test',
      } as unknown) as User;
      jest.spyOn(jwtService, 'sign').mockImplementation(() => tokenWithPayload);

      const result = service.login(payloadToLogin);

      expect(result).toEqual({ accessToken: tokenWithPayload });
      expect(jwtService.sign).toHaveBeenCalledWith(payloadToLogin);
    });

    it('should throw exception `Wrong credentials provided` when user exist but password empty', async () => {
      mockUsersService.getByUsername.mockReturnValue({
        id: 1,
        username: 'user_test',
        password: 'user_pass',
      });

      const result = async () => {
        await service.validateUser(mockCredentialsDto.username, '');
      };

      await expect(result).rejects.toThrow('Wrong credentials provided');
      expect(mockUsersService.getByUsername).toHaveBeenCalledWith(
        mockCredentialsDto.username,
      );
    });

    it('should throw exception `Wrong credentials provided` when user exist but password not valid', async () => {
      mockUsersService.getByUsername.mockReturnValue({
        id: 1,
        username: 'user_test',
        password: 'user_pass',
      });
      const result = async () => {
        await service.validateUser(mockCredentialsDto.username, 'wrong_pass');
      };

      await expect(result).rejects.toThrow('Wrong credentials provided');
      expect(mockUsersService.getByUsername).toHaveBeenCalledWith(
        mockCredentialsDto.username,
      );
    });

    it('should throw exception `Wrong credentials provided` when user does not exist', async () => {
      mockUsersService.getByUsername.mockRejectedValue(
        new Error('User with this username does not exist'),
      );

      const loginResponse = async () => {
        await service.validateUser('wrong_user', mockCredentialsDto.password);
      };

      await expect(loginResponse).rejects.toThrow('Wrong credentials provided');
    });

    it('should throw exception `Wrong credentials provided` when user input wrong data', async () => {
      mockUsersService.getByUsername.mockRejectedValue(
        new Error('User with this username does not exist'),
      );

      const loginResponse = async () => {
        await service.validateUser('wrong_user', 'wrong_pass');
      };

      await expect(loginResponse).rejects.toThrow('Wrong credentials provided');
    });
  });

  describe('#register', () => {
    it('shoulg register and return user', async () => {
      const user = ({
        id: 1,
        username: mockCredentialsDto.username,
      } as unknown) as User;
      const hashedPassword = 'hashedpass';
      bcryptHash = jest.fn().mockReturnValue(hashedPassword);
      (bcrypt.hash as jest.Mock) = bcryptHash;

      mockUsersService.checkByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(user);

      const result = await service.register(mockCredentialsDto);

      expect(result).toEqual(user);
      expect(mockUsersService.checkByUsername).toHaveBeenCalledWith(
        mockCredentialsDto.username,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(mockCredentialsDto.password, 10);
      expect(mockUsersService.create).toHaveBeenCalled();
    });

    it('should throw bad request exception when user already exists', async () => {
      const user = ({
        id: 1,
        username: mockCredentialsDto.username,
      } as unknown) as User;
      mockUsersService.checkByUsername.mockResolvedValue(user);

      await expect(service.register(mockCredentialsDto)).rejects.toThrow(
        'User with that username already exists',
      );

      expect(mockUsersService.checkByUsername).toHaveBeenCalledWith(
        mockCredentialsDto.username,
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });
});
