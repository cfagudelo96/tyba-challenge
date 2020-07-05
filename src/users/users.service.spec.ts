import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

describe('UsersService', () => {
  const user = new User({
    email: 'cf.agudelo96@gmail.com',
    name: 'Carlos Agudelo',
    password: 'Test12345',
    createdAt: new Date(),
  });

  let repository: Repository<User>;
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
      ],
    }).compile();
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
});
