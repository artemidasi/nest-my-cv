import { Test } from '@nestjs/testing';
import { ISession, UsersController } from './users.controller';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'asd',
          },
        ] as User[]);
      },
      findOne: (id) => {
        return Promise.resolve({
          id,
          email: 'asd.asd',
          password: 'asd',
        } as User);
      },

      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
      // signup: () => {},
    };

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asd@.asdasd.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asd@.asdasd.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);

    const user = await controller.findUser('1');

    expect(user).toBeDefined();
  });

  it('signin updated session object and returns user', async () => {
    const session: ISession = {
      userId: null,
    };

    const user = await controller.signin(
      {
        email: 'asdasd@asd.com',
        password: '123',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
