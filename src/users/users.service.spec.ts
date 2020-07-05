import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto } from './dtos/log-in.dto';

describe('UsersService', () => {
  const user = new User({
    id: 12345,
    email: 'cf.agudelo96@gmail.com',
    name: 'Carlos Agudelo',
    password: 'Test12345',
    createdAt: new Date(),
  });

  let repository: Repository<User>;
  let jwtService: JwtService;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('finds a user by id', () => {
    const id = 12345;

    it('should throw an error if the user is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);
      try {
        await service.findByIdOrFail(id);
        fail();
      } catch (error) {
        expect(error.message).toBe('The user was not found');
      }
    });

    it('should return the user', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      const returnedUser = await service.findByIdOrFail(id);
      expect(returnedUser).toBe(user);
    });
  });

  describe('registers a new user', () => {
    const createUserDto = new CreateUserDto({
      email: 'cf.agudelo96@gmail.com',
      name: 'Carlos Agudelo',
      password: 'Test12345',
    });

    it('should send to save the new user', async () => {
      (repository.save as jest.Mock).mockResolvedValue(user);
      const createdUser = await service.register(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createUserDto);
      expect(createdUser).toBe(user);
    });

    it('should throw an error if there is a user with the same email', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      try {
        await service.register(createUserDto);
        fail();
      } catch (error) {
        expect(error.message).toBe('The email provided is already in use');
      }
    });
  });

  describe('logs in a user', () => {
    const logInRequestDto: LogInRequestDto = {
      email: 'cf.agudelo96@gmail.com',
      password: 'Test12345',
    };

    it('should throw an error if the email given is not registered', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);
      try {
        await service.logIn(logInRequestDto);
        fail();
      } catch (error) {
        expect(error.message).toBe(
          'There is no user registered with the email provided',
        );
      }
    });

    it('should throw an error if the password given is incorrect', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        isSamePassword: jest.fn().mockResolvedValue(false),
      });
      try {
        await service.logIn(logInRequestDto);
        fail();
      } catch (error) {
        expect(error.message).toBe('Invalid password');
      }
    });

    it('should work correctly', async () => {
      const token = 'fake.jwt.token';
      const id = user.id;
      (jwtService.sign as jest.Mock).mockReturnValue(token);
      (repository.findOne as jest.Mock).mockResolvedValue({
        isSamePassword: jest.fn().mockResolvedValue(true),
        id,
      });
      const result = await service.logIn(logInRequestDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ id });
      expect(result).toEqual({ token });
    });
  });
});
